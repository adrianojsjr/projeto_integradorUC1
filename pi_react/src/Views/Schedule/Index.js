import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useParams } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";

import { supabase } from '../../User';

import "./schedule.css";


function Schedule() {
  const nav = useNavigate();
  const { id } = useParams();


  const [schedule, setSchedule] = useState([{
    date: "",
    doctor_id: "",
    status: "",
    avaliacao: "",
    patient_id: "",
    payment_id: ""
  }]);

  useEffect(() => {
    readSchedule();
  }, []);

  async function creatSchedule() {
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão atual
    const uid = sessionData?.session?.user?.id; // Pega ID do usuário logado

    if (!uid) return nav("/user", { replace: true }); // Redireciona se não houver UID

    // Insere novo horário no Supabase
    const { data, error } = await supabase
      .from('schedule')
      .insert([
        {
          date: schedule[0].date,
          doctor_id: uid,
          status: "Disponível"
        },
      ])
      .select(); // Retorna os dados inseridos

    setSchedule(prev => [...prev, ...[data]]); // Atualiza estado adicionando novo horário
    setInserirAgenda(false); // Fecha formulário
    window.location.reload(); // Recarrega a página

  }

  async function readSchedule() {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    let query = supabase
      .from('schedule')
      .select(`*, doctors!inner(nome)`);

    if (tipoUsuario === 'doctor') {
      query = query.eq('doctor_id', uid);
    } else if (tipoUsuario === 'patient') {
      query = query.eq('patient_id', uid);
    }

    let { data: dataSchedule, error } = await query;

    if (error) {
      console.log("Erro ao buscar agenda:", error);
    } else {
      setSchedule(dataSchedule || []);
    }
  }


  async function delSchedule(id) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('supra_id', id);
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
                    value={schedule.date} // Valor do estado
                    onChange={(e) => setSchedule([{ ...schedule, date: e.target.value }])} // Atualiza estado
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
                    {tipoUsuario !== 'patient' && <th>Status</th>}  {/* Oculta para paciente */}
                    <th>Avaliação</th>
                    <th>Paciente</th>
                    <th>Pagamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((agenda) => (
                    <tr key={agenda.id} className="agendaCard">
                      <td>{agenda.date}</td>
                      <td>{agenda.doctors?.nome}</td>
                      {tipoUsuario !== 'patient' && <td>{agenda.status}</td>} {/* Oculta para paciente */}
                      <td>{agenda.avaliacao}</td>
                      <td>{agenda.patient_id}</td>
                      <td>{agenda.payment_id}</td>
                      <td>
                        {/* botões etc */}
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
