import { useState, useEffect } from 'react'; // Importa funções do React para criar estados e rodar código quando o componente é carregado
import { createClient } from "@supabase/supabase-js"; // Importa função para se conectar ao Supabase
import { useNavigate, useParams } from 'react-router-dom'; // Importa funções para navegar entre páginas e pegar parâmetros da URL

import "react-datepicker/dist/react-datepicker.css"; // Importa estilo para o calendário

import { supabase } from '../User/Index'; // Importa a conexão com o Supabase

import "./schedule.css"; // Importa o estilo da página


function Schedule() { // Componente principal da agenda
  const nav = useNavigate(); // Função para navegar para outra página
  const { id } = useParams(); // Pega parâmetro da URL (não usado aqui, mas pode ser útil)

  const [schedule, setSchedule] = useState([]); // Estado que guarda todos os horários/consultas
  const [novaSchedule, setNovaSchedule] = useState({ // Estado para criar um novo horário
    date: "", // Data e hora
    status: "Disponível" // Status inicial
  });

  const [inserirAgenda, setInserirAgenda] = useState(false); // Controla se o formulário de novo horário está aberto
  const tipoUsuario = localStorage.getItem('tipoUsuario'); // Pega se é 'doctor' ou 'patient' do armazenamento local

  useEffect(() => { // Código que roda quando o componente é carregado
    readSchedule(); // Chama a função para pegar os horários do banco
  }, []);

  // Função para criar um novo horário
  async function creatSchedule() {
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão do usuário
    const uid = sessionData?.session?.user?.id; // Pega o ID do usuário logado

    if (!uid) return nav("/user", { replace: true }); // Se não tiver usuário, volta para a página de login

    // Converte a data do input para objeto Date local
    const [datePart, timePart] = novaSchedule.date.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const localDate = new Date(year, month - 1, day, hour, minute);

    // Transforma em string ISO sem o "Z" (não transforma em UTC)
    const isoLocal = localDate.toISOString().slice(0, 19);

    // Insere novo horário no Supabase
    const { data, error } = await supabase
      .from('schedule')
      .insert([
        {
          date: isoLocal,
          doctor_id: uid,
          status: "Disponível"
        },
      ])
      .select(); // Retorna os dados inseridos

    if (error) {
      console.log("Erro ao criar agenda:", error.message); // Mostra erro no console
    } else {
      setSchedule(prev => [...prev, ...data]); // Adiciona novo horário na lista
      setNovaSchedule({ date: "", status: "Disponível" }); // Limpa formulário
      setInserirAgenda(false); // Fecha formulário
      window.location.reload(); // Recarrega a página
    }
  }

  // Função para pegar todos os horários
  async function readSchedule() {
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão do usuário
    const uid = sessionData?.session?.user?.id; // ID do usuário logado
    const tipoUsuario = localStorage.getItem('tipoUsuario'); // Tipo do usuário

    // Começa a query
    let query = supabase
      .from('schedule') // Tabela de horários
      .select(`*, doctors!inner(nome), patient:patient_id(nome), payment(status)`);
    // Pega os horários, nome do médico, nome do paciente e status do pagamento

    // Filtra os horários de acordo com o usuário
    if (tipoUsuario === 'doctor') {
      query = query.eq('doctor_id', uid); // Médico vê só os horários dele
    } else if (tipoUsuario === 'patient') {
      query = query.or(`patient_id.eq.${uid},statusPatient.eq.Cancelada`);
      // Paciente vê consultas ativas ou canceladas dele
    }

    query = query.order('date', { ascending: false }); // Ordena da data mais recente para a mais antiga

    const { data: dataSchedule, error } = await query; // Executa a query

    if (error) {
      console.log("Erro ao buscar agenda:", error); // Mostra erro se houver
    } else {
      setSchedule(dataSchedule || []); // Guarda os horários no estado
    }
  }

  // Função para atualizar status do pagamento
  async function updatePayment(idPagamento) {
    if (!idPagamento) return; // Se não tiver pagamento, sai

    const { data: dU } = await supabase.auth.getUser(); // Pega usuário logado
    const uid = dU?.user?.id;

    const { data: dataP, error: errorP } = await supabase
      .from('payment')
      .update({ status: 'Cancelado' }) // Atualiza status do pagamento
      .eq('id', idPagamento)
      .select()
      .single();

    if (errorP) {
      console.error('Erro ao atualizar pagamento', errorP);
    } else {
      console.log("Pagamento atualizado:", dataP);

      // Atualiza somente o pagamento dentro do array de horários
      setSchedule(prev =>
        prev.map(ag =>
          ag.payment_id === idPagamento
            ? { ...ag, payment: { ...ag.payment, status: 'Cancelado' } }
            : ag
        )
      );
    }
  }

  // Função para atualizar status do horário quando paciente cancela
  async function updateSchedule(scheduleId) {
    if (!scheduleId) return;

    const { data, error } = await supabase
      .from('schedule')
      .update({
        status: 'Disponível',       // Horário volta a estar livre
        statusPatient: 'Cancelada', // Marca histórico do paciente como cancelado
        avaliacao: null,
        payment_id: null            // Libera referência do pagamento
      })
      .eq('id', scheduleId)
      .select()
      .single();

    if (!error) {
      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId
            ? {
              ...ag,
              status: 'Disponível',
              statusPatient: 'Cancelada',
              payment_id: ag.payment_id,
              payment: { ...(ag.payment || {}), status: 'Reembolsado' }
            }
            : ag
        )
      );
    }
  }

  // Função para cancelar uma consulta (chama as duas funções acima)
  async function cancelarConsulta(scheduleId, idPagamento) {
    await updatePayment(idPagamento); // Cancela pagamento
    await updateSchedule(scheduleId); // Atualiza horário
    alert("Consulta cancelada!"); // Mensagem para o usuário
  }

  // Função para finalizar uma consulta (paciente concluiu)
  async function finalizarConsulta(scheduleId) {
    if (!scheduleId) return;

    const { data, error } = await supabase
      .from('schedule')
      .update({
        statusPatient: 'Concluída', // Marca como concluída
      })
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao finalizar consulta:', error);
      return;
    }

    alert('Consulta concluída!');
    setSchedule(prev =>
      prev.map(ag =>
        ag.id === scheduleId ? { ...ag, statusPatient: 'Concluída' } : ag
      )
    );
  }

  // Função para mostrar a data em formato dia/mês/ano e hora:minuto
  function formatarData(data) {
    const date = new Date(data);

    const dataFormatada = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const horaFormatada = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dataFormatada} ${horaFormatada}`;
  }

  // Função para deletar um horário
  async function delSchedule(scheduleId) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', scheduleId);

    if (error) {
      console.log("ERRO AO DELETAR AGENDA:", error.message);
    } else {
      console.log("AGENDA DELETADA");
      setSchedule(prev => prev.filter(ag => ag.id !== scheduleId)); // Remove da lista
    }
  }

  // Função inserir a avaliação do paciente
  async function updateAvaliacao(scheduleId, valor) {
    const { data, error } = await supabase
      .from('schedule')
      .update({ avaliacao: valor })
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar avaliação:', error);
      return;
    } else {
      setSchedule(prev =>
        prev.map(ag =>
          ag.id === scheduleId ? { ...ag, avaliacao: valor } : ag
        )
      );

      // Buscar próxima consulta do paciente para aplicar desconto
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id;

      const { data: proximas, error: errNext } = await supabase
        .from('schedule')
        .select()
        .eq('patient_id', uid)
        .neq('statusPatient', 'Concluída')
        .order('date', { ascending: true })
        .limit(1);

      if (errNext) {
        console.error("Erro ao buscar próxima consulta:", errNext);
        return;
      }

      if (proximas && proximas.length > 0) {
        const proximaConsultaId = proximas[0].id;

        // Criar registro de desconto na tabela desconto
        const { data: descontoData, error: descontoError } = await supabase
          .from('desconto')
          .insert([
            {
              patient_id: uid,
              schedule_id: proximaConsultaId,
              percentual: 10,
              usado: false,
            },
          ]);

        if (descontoError) {
          console.error("Erro ao criar desconto:", descontoError);
        } else {
          alert("Obrigado pela avaliação! Você ganhou 10% de desconto na próxima consulta.");
        }
      }
    }
  }


  return (
    <div className="alinhamentoPagina">
      {tipoUsuario === 'patient' && schedule.length === 0 ? (
        <p className="semConsulta">Nenhuma consulta encontrada.</p>
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
                  <button type="button" onClick={creatSchedule}>
                    Adicionar
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="agendaContainer">
            <table className="tabelaAgenda">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Médico</th>
                  {tipoUsuario !== 'patient' ? <th>Paciente</th> : null}
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((agenda) => (
                  <tr key={agenda.id} className="agendaCard">
                    <td>{agenda?.date ? formatarData(agenda.date) : ''}</td>
                    <td>{agenda.doctors?.nome}</td>
                    {tipoUsuario !== 'patient' ? <td>{agenda.patient?.nome}</td> : null}
                    <td>{agenda.statusPatient}</td>
                    <td>
                      {tipoUsuario === 'patient'
                        ? agenda.payment?.status || 'Reembolsado'
                        : agenda.payment?.status || ''}
                    </td>
                    <td>
                      {tipoUsuario === 'patient' ? (
                        agenda.statusPatient === 'Cancelada' ? (
                          <span>Consulta cancelada</span>
                        ) : agenda.statusPatient !== 'Concluída' ? (
                          <span></span> // Ou apenas vazio
                        ) : agenda.avaliacao ? (
                          agenda.avaliacao
                        ) : (
                          <select
                            value={agenda.avaliacao || ''}
                            onChange={(e) => updateAvaliacao(agenda.id, parseInt(e.target.value))}
                          >
                            <option value="">Avalie sua consulta</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        )
                      ) : (
                        agenda.avaliacao
                      )}
                    </td>
                    <td>
                      {tipoUsuario === 'patient' ? (
                        <button
                          onClick={() => cancelarConsulta(agenda.id, agenda.payment_id)}
                          disabled={
                            agenda.statusPatient === 'Cancelada' ||
                            agenda.statusPatient === 'Concluída'
                          }
                        >
                          Cancelar consulta
                        </button>
                      ) : agenda.patient_id ? (
                        <button
                          onClick={() => finalizarConsulta(agenda.id)}
                          disabled={agenda.statusPatient === "Concluída"}
                        >
                          Finalizar consulta
                        </button>
                      ) : (
                        <button onClick={() => delSchedule(agenda.id)}>Deletar</button>
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

export default Schedule; // Exporta o componente para poder usar em outras páginas
