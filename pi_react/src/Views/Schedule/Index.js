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
  const [loading, setLoading] = useState(false); // Estado para ações em andamento
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
    const { data } = await supabase.auth.getSession();
    return data?.session?.user?.id;
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

    // Converte string ISO para data local sem fuso
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
      console.error(error.message);
    } else {
      setSchedule(prev => [...prev, ...data]);
      setNovaSchedule({ date: "", status: "Disponível" });
      setInserirAgenda(false);
      exibirMsg("Horário criado com sucesso!");
    }
  }

  // Lê os horários do banco, com filtros por tipo de usuário
  async function readSchedule() {
    const uid = await getCurrentUserId();

    let query = supabase
      .from('schedule')
      .select(`*, doctors!inner(nome), patient:patient_id(nome), payment(status)`)
      .order('date', { ascending: false });

    if (tipoUsuario === 'doctor') {
      query = query.eq('doctor_id', uid);
    } else if (tipoUsuario === 'patient') {
      query = query.or(`patient_id.eq.${uid},statusPatient.eq.Cancelada`);
    }

    const { data: dataSchedule, error } = await query;

    if (error) {
      exibirMsg("Erro ao buscar agenda.");
      console.error(error);
    } else {
      setSchedule(dataSchedule || []);
    }
  }

  // Cancela o pagamento vinculado a uma consulta
  async function updatePayment(idPagamento) {
    if (!idPagamento) return;

    const { error } = await supabase
      .from('payment')
      .update({ status: 'Cancelado' })
      .eq('id', idPagamento);

    if (error) {
      console.error('Erro ao cancelar pagamento:', error);
    } else {
      setSchedule(prev =>
        prev.map(ag =>
          ag.payment_id === idPagamento
            ? { ...ag, payment: { ...ag.payment, status: 'Cancelado' } }
            : ag
        )
      );
    }
  }

  // Atualiza a consulta após cancelamento
  async function updateSchedule(scheduleId) {
    const { data, error } = await supabase
      .from('schedule')
      .update({
        status: 'Disponível',
        statusPatient: 'Cancelada',
        avaliacao: null,
        payment_id: null
      })
      .eq('id', scheduleId)
      .select()
      .single();

    if (!error) {
      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId
            ? { ...ag, status: 'Disponível', statusPatient: 'Cancelada', payment: { ...(ag.payment || {}), status: 'Reembolsado' } }
            : ag
        )
      );
    }
  }

  // Cancela consulta (paciente)
  async function cancelarConsulta(scheduleId, idPagamento) {
    await updatePayment(idPagamento);
    await updateSchedule(scheduleId);
    exibirMsg("Consulta cancelada com sucesso!");
  }

  // Finaliza uma consulta (médico)
  async function finalizarConsulta(scheduleId) {
    const { error } = await supabase
      .from('schedule')
      .update({ statusPatient: 'Concluída' })
      .eq('id', scheduleId);

    if (!error) {
      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId ? { ...ag, statusPatient: 'Concluída' } : ag
        )
      );
      exibirMsg('Consulta concluída!');
    } else {
      console.error('Erro ao finalizar consulta:', error);
    }
  }

  // Deleta um horário (sem paciente)
  async function deleteSchedule(scheduleId) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', scheduleId);

    if (!error) {
      setSchedule(prev => prev.filter(ag => ag.id !== scheduleId));
      exibirMsg("Horário deletado!");
    } else {
      console.error("Erro ao deletar:", error.message);
    }
  }

  // Avaliação do paciente e criação de desconto
  async function updateAvaliacao(scheduleId, valor) {
    const { error } = await supabase
      .from('schedule')
      .update({ avaliacao: valor })
      .eq('id', scheduleId);

    if (error) {
      console.error('Erro ao avaliar:', error);
      return;
    }

    setSchedule(prev =>
      prev.map(ag =>
        ag.id === scheduleId ? { ...ag, avaliacao: valor } : ag
      )
    );

    exibirMsg("Obrigado pela avaliação! Você terá 10% de desconto na próxima consulta.");

    // Aplica desconto na próxima consulta
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

      // Verifica se já existe desconto
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
  }

  // Formata a data para dd/mm/yyyy hh:mm
  function formatarData(data) {
    const date = new Date(data);
    const dia = date.toLocaleDateString('pt-BR');
    const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dia} ${hora}`;
  }

  return (
    <div className="alinhamentoPagina">
      {msg && <div className="msgFeedback">{msg}</div>}

      {tipoUsuario === 'patient' && schedule.length === 0 ? (
        <p className="semConsulta">Nenhuma consulta encontrada.</p>
      ) : (
        <>
          {/* Formulário de novo horário (para médicos) */}
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

          {/* Tabela de agenda */}
          <div className="agendaContainer">
            <table className="tabelaAgenda">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Médico</th>
                  {tipoUsuario !== 'patient' && <th>Paciente</th>}
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((agenda) => (
                  <tr key={agenda.id}>
                    <td>{agenda?.date ? formatarData(agenda.date) : ''}</td>
                    <td>{agenda.doctors?.nome}</td>
                    {tipoUsuario !== 'patient' && <td>{agenda.patient?.nome}</td>}
                    <td>{agenda.statusPatient}</td>
                    <td>{agenda.payment?.status || 'Reembolsado'}</td>
                    <td>
                      {tipoUsuario === 'patient' && agenda.statusPatient === 'Concluída' ? (
                        agenda.avaliacao ? (
                          agenda.avaliacao
                        ) : (
                          <select
                            value={agenda.avaliacao || ''}
                            onChange={(e) => updateAvaliacao(agenda.id, parseInt(e.target.value))}
                          >
                            <option value="">Avalie sua consulta</option>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        )
                      ) : (
                        agenda.avaliacao || ''
                      )}
                    </td>
                    <td>
                      {tipoUsuario === 'patient' && !['Cancelada', 'Concluída'].includes(agenda.statusPatient) ? (
                        <button onClick={() => cancelarConsulta(agenda.id, agenda.payment_id)}>Cancelar</button>
                      ) : tipoUsuario === 'doctor' && agenda.patient_id ? (
                        <button
                          onClick={() => finalizarConsulta(agenda.id)}
                          disabled={agenda.statusPatient === "Concluída"}
                        >
                          Finalizar
                        </button>
                      ) : (
                        tipoUsuario === 'doctor' && (
                          <button onClick={() => deleteSchedule(agenda.id)}>Deletar</button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Schedule;
