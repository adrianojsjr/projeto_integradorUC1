import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../User/Index';

import "react-datepicker/dist/react-datepicker.css";
import "./schedule.css";

// Função principal do componente Schedule
function Schedule() {
  const nav = useNavigate();
  const { id } = useParams();
  const [msg, setMsg] = useState(""); // Mensagem de feedback
  const [loading, setLoading] = useState(true); // Estado para carregamento inicial
  const [schedule, setSchedule] = useState([]); // Lista de horários/consultas
  const [novaSchedule, setNovaSchedule] = useState({ date: "", status: "Disponível" }); // Formulário de novo horário
  const [inserirAgenda, setInserirAgenda] = useState(false); // Mostrar ou ocultar o formulário
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  // Função para exibir mensagem temporária
  const exibirMsg = (texto, tempo = 3000) => {
    setMsg(texto);
    setTimeout(() => setMsg(""), tempo);
  }

  // Função utilitária para obter ID do usuário atual
  async function getCurrentUserId() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
      }
      return data?.session?.user?.id;
    } catch (error) {
      console.error('Erro inesperado:', error);
      return null;
    }
  }

  // Carrega os horários ao carregar a página
  useEffect(() => {
    readSchedule();
  }, []);

  // Cria um novo horário de consulta
  async function createSchedule() {
    const uid = await getCurrentUserId();
    if (!uid) return nav("/user", { replace: true });

    if (!novaSchedule.date) {
      exibirMsg("Preencha corretamente a data e hora.");
      return;
    }

    setLoading(true);
    try {
      const [datePart, timePart] = novaSchedule.date.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hour, minute);
      const isoLocal = localDate.toISOString().slice(0, 19);

      const { data, error } = await supabase
        .from('schedule')
        .insert([{ date: isoLocal, doctor_id: uid, status: "Disponível" }])
        .select();

      if (error) {
        exibirMsg("Erro ao criar horário.");
      } else {

        setSchedule(prev => [...prev, ...data]);
        setNovaSchedule({ date: "", status: "Disponível" });
        setInserirAgenda(false);
        exibirMsg("Horário criado com sucesso!");
        await readSchedule();
      }
    } catch (error) {
      exibirMsg("Erro inesperado ao criar horário.");
    } finally {
      setLoading(false);
    }
  }

  // Lê os horários do banco, com filtros por tipo de usuário
  async function readSchedule() {
    setLoading(true);
    try {
      const uid = await getCurrentUserId();
      if (!uid) {
        nav("/user", { replace: true });
        return;
      }

      let query = supabase
        .from('schedule')
        .select(`*, 
           doctors!inner(nome), 
           patient:patient_id(nome), 
           payment:payment_id(status)`) 
        .order('date', { ascending: false });

      if (tipoUsuario === 'doctor') {
        query = query.eq('doctor_id', uid);
      } else if (tipoUsuario === 'patient') {
        query = query.eq('patient_id', uid);
      }

      const { data: dataSchedule, error } = await query;

      if (error) {
        exibirMsg("Erro ao buscar agenda.");
      } else {
        setSchedule(dataSchedule || []);
      }
    } catch (error) {
      exibirMsg("Erro inesperado ao carregar agenda.");
    } finally {
      setLoading(false);
    }
  }

  // Cancela o pagamento vinculado a uma consulta
  async function updatePayment(idPagamento) {
    if (!idPagamento) return;

    try {
      const { error } = await supabase
        .from('payment')
        .update({ status: 'Cancelado' })
        .eq('id', idPagamento);

      if (error) {
        throw error;
      } else {
        setSchedule(prev =>
          prev.map(ag =>
            ag.payment_id === idPagamento
              ? { ...ag, payment: { ...ag.payment, status: 'Cancelado' } }
              : ag
          )
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Atualiza a consulta após cancelamento
  async function updateSchedule(scheduleId) {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .update({
          status: 'Disponível',
          statusPatient: 'Cancelada',
          avaliacao: null,
          patient_id: null,
          payment_id: null
        })
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;

      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId
            ? {
              ...ag,
              status: 'Disponível',
              statusPatient: 'Cancelada',
              patient_id: null,
              patient: null,
              payment: null
            }
            : ag
        )
      );
    } catch (error) {
      throw error;
    }
  }

  // Cancela consulta (paciente)
  async function cancelarConsulta(scheduleId, idPagamento) {
    setLoading(true);
    try {
      if (idPagamento) {
        await updatePayment(idPagamento);
      }
      await updateSchedule(scheduleId);
      exibirMsg("Consulta cancelada com sucesso!");
    } catch (error) {
      exibirMsg("Erro ao cancelar consulta.");
    } finally {
      setLoading(false);
    }
  }

  // Finaliza uma consulta (médico)
  async function finalizarConsulta(scheduleId) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedule')
        .update({ statusPatient: 'Concluída' })
        .eq('id', scheduleId);

      if (error) {
        exibirMsg('Erro ao finalizar consulta.');
      } else {
        setSchedule(prev =>
          prev.map(ag =>
            ag.id === scheduleId ? { ...ag, statusPatient: 'Concluída' } : ag
          )
        );
        exibirMsg('Consulta concluída!');
      }
    } catch (error) {
      exibirMsg('Erro inesperado ao finalizar consulta.');
    } finally {
      setLoading(false);
    }
  }

  // Deleta um horário (sem paciente)
  async function deleteSchedule(scheduleId) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedule')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        exibirMsg("Erro ao deletar horário.");
      } else {
        setSchedule(prev => prev.filter(ag => ag.id !== scheduleId));
        exibirMsg("Horário deletado!");
      }
    } catch (error) {
      exibirMsg("Erro inesperado ao deletar horário.");
    } finally {
      setLoading(false);
    }
  }

  // Avaliação do paciente e criação de desconto
  async function updateAvaliacao(scheduleId, valor) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedule')
        .update({ avaliacao: valor })
        .eq('id', scheduleId);

      if (error) {
        exibirMsg('Erro ao enviar avaliação.');
        return;
      }

      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId ? { ...ag, avaliacao: valor } : ag
        )
      );

      exibirMsg("Obrigado pela avaliação! Você terá 10% de desconto na próxima consulta.");

      const uid = await getCurrentUserId();
      const { data: proximas } = await supabase
        .from('schedule')
        .select()
        .eq('patient_id', uid)
        .neq('statusPatient', 'Concluída')
        .order('date', { ascending: true })
        .limit(1);

      if (proximas?.length > 0) {
        const proximaConsultaId = proximas[0].id;

        const { data: descontosExistentes } = await supabase
          .from('desconto')
          .select()
          .eq('schedule_id', proximaConsultaId);

        if (!descontosExistentes || descontosExistentes.length === 0) {
          await supabase
            .from('desconto')
            .insert([{ patient_id: uid, schedule_id: proximaConsultaId, percentual: 10, usado: false }]);
        }
      }
    } catch (error) {
      exibirMsg('Erro inesperado ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  }

  // Função para exibir o status correto baseado no tipo de usuário
  function getStatusExibicao(agenda) {
    if (tipoUsuario === 'doctor') {
      // Para o médico, horários cancelados aparecem como "Disponível"
      return agenda.statusPatient === 'Cancelada' ? 'Disponível' : (agenda.statusPatient || 'Disponível');
    } else {
      // Para o paciente, mostra o status real
      return agenda.statusPatient || 'Disponível';
    }
  }

  // Função para determinar o status do pagamento - VERSÃO SÍNCRONA
  function getStatusPagamento(agenda) {
    // Se payment é null mas existe payment_id, assumimos que está "Pago"
    // (já que a query deveria trazer os dados do pagamento)
    if (agenda.payment === null && agenda.payment_id) {
      return 'Pago'; // Assumindo que se tem payment_id, está pago
    }

    // Se tem payment com status, usa o status real
    if (agenda.payment?.status) {
      return agenda.payment.status;
    }

    // Lógica para casos sem pagamento
    if (tipoUsuario === 'doctor') {
      return agenda.statusPatient === 'Cancelada' ? '--' : (agenda.patient_id ? 'Pendente' : '--');
    } else {
      return agenda.statusPatient === 'Cancelada' ? 'Reembolsado' : (agenda.patient_id ? 'Pendente' : '--');
    }
  }

  // Formata a data para dd/mm/yyyy hh:mm
  function formatarData(data) {
    try {
      const date = new Date(data);
      if (isNaN(date.getTime())) return 'Data inválida';

      const dia = date.toLocaleDateString('pt-BR');
      const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${dia} ${hora}`;
    } catch (error) {
      return 'Data inválida';
    }
  }

  const hasData = schedule && schedule.length > 0;

  return (
    <div className="alinhamentoPagina">
      {msg && <div className="msgFeedback">{msg}</div>}

      {loading ? (
        <div className="carregando">Carregando...</div>
      ) : (
        <>
          {tipoUsuario === "doctor" && (
            <div className="agenda">
              <button onClick={() => setInserirAgenda(!inserirAgenda)}>
                {inserirAgenda ? "Fechar formulário" : "Adicionar Novo Horário"}
              </button>

              {inserirAgenda && (
                <form className="addScheduleForm" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="datetime-local"
                    value={novaSchedule.date}
                    onChange={(e) => setNovaSchedule({ ...novaSchedule, date: e.target.value })}
                  />
                  <button type="button" onClick={createSchedule}>Adicionar</button>
                </form>
              )}
            </div>
          )}

          {!hasData ? (
            <p className="semConsulta">
              {tipoUsuario === 'patient'
                ? "Nenhuma consulta encontrada."
                : "Nenhum horário encontrado."
              }
            </p>
          ) : (
            <div className="agendaContainer">
              <table className="tabelaAgenda">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Médico</th>
                    {tipoUsuario !== 'patient' && <th>Paciente</th>}
                    <th>Status</th>
                    <th>Pagamento</th>
                    <th>Ações</th>
                    <th>Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((agenda) => (
                    <tr key={agenda.id}>
                      <td data-label="Data">{formatarData(agenda.date)}</td>
                      <td data-label="Médico">{agenda.doctors?.nome || '--'}</td>
                      {tipoUsuario !== 'patient' && (
                        <td data-label="Paciente">
                          {agenda.patient?.nome || '--'}
                        </td>
                      )}
                      <td data-label="Status">
                        {getStatusExibicao(agenda)}
                      </td>
                      <td data-label="Pagamento">
                        {getStatusPagamento(agenda)}
                      </td>
                      <td data-label="Ações">
                        {tipoUsuario === 'patient' && !['Cancelada', 'Concluída'].includes(agenda.statusPatient) ? (
                          <button
                            className='btnCancel'
                            onClick={() => cancelarConsulta(agenda.id, agenda.payment_id)}
                            disabled={loading}
                          >
                            Cancelar
                          </button>
                        ) : tipoUsuario === 'doctor' && agenda.patient_id && agenda.statusPatient !== 'Cancelada' ? (
                          <button
                            className='btnFinalize'
                            onClick={() => finalizarConsulta(agenda.id)}
                            disabled={agenda.statusPatient === "Concluída"}
                          >
                            Finalizar
                          </button>
                        ) : tipoUsuario === 'doctor' && (!agenda.patient_id || agenda.statusPatient === 'Cancelada') ? (
                          <button
                            className='btnDelete'
                            onClick={() => deleteSchedule(agenda.id)}
                          >
                            Deletar
                          </button>
                        ) : (
                          <span className="sem-acoes">Nenhuma ação disponível</span>
                        )}
                      </td>
                      <td data-label="Avaliação">
                        {tipoUsuario === 'patient' && agenda.statusPatient === 'Concluída' ? (
                          agenda.avaliacao ? (
                            <div className="avaliacao-concluida">
                              <span>⭐ {agenda.avaliacao}/5</span>
                            </div>
                          ) : (
                            <select
                              value={agenda.avaliacao || ''}
                              onChange={(e) => updateAvaliacao(agenda.id, parseInt(e.target.value))}
                            >
                              <option value="">Avalie sua consulta</option>
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                            </select>
                          )
                        ) : (
                          <span className="avaliacao-pendente">
                            {agenda.avaliacao ? `⭐ ${agenda.avaliacao}/5` : '--'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Schedule;