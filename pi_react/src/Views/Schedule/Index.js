import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useParams } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";

import { supabase } from '../../User';

import "./schedule.css";


function Schedule() {
  const nav = useNavigate();
  const { id } = useParams();


  const [schedule, setSchedule] = useState([]);

  const [novaSchedule, setNovaSchedule] = useState({
    date: "",
    status: "Disponível"

  });

  useEffect(() => {
    readSchedule();
  }, []);

  async function creatSchedule() {
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão atual
    const uid = sessionData?.session?.user?.id; // Pega ID do usuário logado

    if (!uid) return nav("/user", { replace: true }); // Redireciona se não houver UID

    // Cria objeto Date local
    const [datePart, timePart] = novaSchedule.date.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const localDate = new Date(year, month - 1, day, hour, minute);

    // Converte para ISO local sem o "Z" que indica UTC
    const isoLocal = localDate.toISOString().slice(0, 19);

    // Insere novo horário no Supabase
    const { data, error } = await supabase
      .from('schedule')
      .insert([
        {
          date: isoLocal,   // envia data no fuso local
          doctor_id: uid,
          status: "Disponível"
        },
      ])
      .select(); // Retorna os dados inseridos

    if (error) {
      console.log("Erro ao criar agenda:", error.message);
    } else {

      setSchedule(prev => [...prev, ...data]); // Atualiza estado adicionando novo horário
      setNovaSchedule({ date: "", status: "Disponível" });
      setInserirAgenda(false); // Fecha formulário
      window.location.reload(); // Recarrega a página

    }
  }

  async function readSchedule() {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    let query = supabase
      .from('schedule')
      .select(`*, doctors!inner(nome), patient:patient_id(nome), payment(status)`);

    if (tipoUsuario === 'doctor') {
      query = query.eq('doctor_id', uid);
    } else if (tipoUsuario === 'patient') {
      // Trazer consultas ativas e canceladas do paciente
      query = query.or(`patient_id.eq.${uid},statusPatient.eq.Cancelada`);
    }

    const { data: dataSchedule, error } = await query;

    if (error) {
      console.log("Erro ao buscar agenda:", error);
    } else {
      setSchedule(dataSchedule || []);
    }
  }
  async function updatePayment(idPagamento) {
    if (!idPagamento) return;

    const { data: dU } = await supabase.auth.getUser();
    const uid = dU?.user?.id;

    const { data: dataP, error: errorP } = await supabase
      .from('payment')
      .update({ status: 'Cancelado' })
      .eq('id', idPagamento)
      .select()
      .single();

    if (errorP) {
      console.error('Erro ao atualizar pagamento', errorP);
    } else {
      console.log("Pagamento atualizado:", dataP);

      // Atualiza apenas o item correspondente dentro do array
      setSchedule(prev =>
        prev.map(ag =>
          ag.payment_id === idPagamento
            ? { ...ag, payment: { ...ag.payment, status: 'Cancelado' } }
            : ag
        )
      );
    }
  }

  async function updateSchedule(scheduleId) {
    if (!scheduleId) return;

    const { data, error } = await supabase
      .from('schedule')
      .update({
        status: 'Disponível',       // Horário fica livre para outro paciente
        statusPatient: 'Cancelada', // Histórico para o paciente
        payment_id: null            // Libera referência do pagamento
        // Não mexer em patient_id, mantém histórico visível
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
              payment_id: ag.payment_id, // mantém referência para mostrar histórico
              payment: { ...(ag.payment || {}), status: 'Reembolsado' }
            }
            : ag
        )
      );
    }
  }

  async function cancelarConsulta(scheduleId, idPagamento) {


    await updatePayment(idPagamento);
    await updateSchedule(scheduleId);
  }



  function formatarData(data) {
    const date = new Date(data)

    const dataFormatada =

      date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const horaFormatada =

      date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    return `${dataFormatada} ${horaFormatada}`;

    //poderia ser também return dataFormatada + ' ' + horaFormatada;
  }

  async function delSchedule(scheduleId) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', scheduleId);

    if (error) {
      console.log("ERRO AO DELETAR AGENDA:", error.message);
    } else {
      console.log("AGENDA DELETADA");
      setSchedule(prev => prev.filter(ag => ag.id !== scheduleId));

    }
  }

  const [inserirAgenda, setInserirAgenda] = useState(false); // Estado para controlar formulário
  const tipoUsuario = localStorage.getItem('tipoUsuario'); // Pega tipo de usuário que foi colocado no arquivo user


  return ( // JSX do componente
    <main>
      <div className="alinhamentoPagina">
        {tipoUsuario === 'patient' && schedule.length === 0 ? ( // Se não houver horários
          <p className="semConsulta">Nenhuma consulta encontrada.</p> // Exibe mensagem
        ) : ( // Se houver horários
          <>{tipoUsuario === "doctor" && (
            <div className="agenda">
              <button onClick={() => setInserirAgenda(!inserirAgenda)}>{inserirAgenda ? "Fechar formulário" : "Adicionar Novo Horário"}
              </button>

              {inserirAgenda && ( // Formulário de adicionar horário
                <form className="addScheduleForm" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="datetime-local" // Input para data
                    value={novaSchedule.date} // Valor do estado
                    onChange={(e) => setNovaSchedule({ ...novaSchedule, date: e.target.value })} // Atualiza estado
                  />
                  <button type="button" onClick={creatSchedule}>
                    Adicionar
                  </button>
                </form>

              )}
            </div>
          )}
            <div className="agendaContainer"> {/* Container da tabela */}
              <table className="tabelaAgenda">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Médico</th>
                    {tipoUsuario !== 'patient' && <th>Paciente</th>}
                    {tipoUsuario === 'patient' && <th>Status</th>}
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

                      {tipoUsuario !== 'patient' && <td>{agenda.patient?.nome}</td>}
                      {tipoUsuario === 'patient' && <td>{agenda.statusPatient}</td>}

                      <td>
                        {tipoUsuario === 'patient'
                          ? agenda.payment?.status || 'Reembolsado'
                          : agenda.payment?.status || ''}
                      </td>

                      <td>{agenda.avaliacao}</td>

                      <td>
                        {tipoUsuario === 'patient'
                          ? <button
                            onClick={() => cancelarConsulta(agenda.id, agenda.payment_id)}
                            disabled={agenda.statusPatient === 'Cancelada'}
                          >
                            Cancelar consulta
                          </button>
                          : <button
                            onClick={() => delSchedule(agenda.id)}

                          >
                            Deletar                        </button>
                        }

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Schedule; // Exporta o componente
