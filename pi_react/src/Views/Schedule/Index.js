import { useState, useEffect } from 'react'; // Importa hooks do React para estado e efeitos
import { createClient } from "@supabase/supabase-js"; // Importa função para criar cliente Supabase (não usado aqui)
import { useNavigate, useParams } from 'react-router-dom'; // Importa hooks do React Router
import Button from 'react-bootstrap/Button'; // Importa botão do React Bootstrap

import { supabase } from '../../User'; // Importa instância do Supabase configurada

import "./Style.css"; // Importa CSS local

function Schedule() { // Componente principal
  const nav = useNavigate(); // Hook de navegação
  const { id } = useParams(); // Pega parâmetro 'id' da rota

  // Estado inicial da agenda
  const [schedule, setSchedule] = useState([{
    date: "", // Data da consulta
    doctor_id: "", // ID do médico
    status: "", // Status da consulta
    avaliacao: "", // Avaliação da consulta
    patient_id: "", // ID do paciente
    payment_id: "" // ID do pagamento
  }]);

  useEffect(() => { // Hook que executa ao montar o componente
    readSchedule(); // Chama função para ler agenda
  }, []);

  async function creatSchedule() { // Função para criar horário
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão atual
    const uid = sessionData?.session?.user?.id; // Pega ID do usuário logado

    if (!uid) return nav("/user", { replace: true }); // Redireciona se não houver UID
    if (!uid) nav("/user", { replace: true }); // Redireciona se não houver UID (linha repetida no código original)

    /* Comentário de código antigo mantido
    if (eU) nav('/user', { replace: true })
    if (!dU) nav('/user', { replace: true })
    if (dU && !dU.id) nav('/user', { replace: true })*/

    // Insere novo horário no Supabase
    const { data, error } = await supabase
      .from('schedule')
      .insert([
        {
          date: schedule[0].date, // Pega a data do estado
          doctor_id: uid, // ID do médico
          status: "Disponível" // Status inicial
        },
      ])
      .select(); // Retorna os dados inseridos

    setSchedule(prev => [...prev, ...[data]]); // Atualiza estado adicionando novo horário
    setInserirAgenda(false); // Fecha formulário
    console.log(data, error); // Log para depuração
  }

  // Função para listar a agenda
  async function readSchedule() {
    const { data: sessionData } = await supabase.auth.getSession(); // Pega sessão
    const uid = sessionData?.session?.user?.id; // ID do usuário logado

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select(` *, doctors!inner(nome)`) // Seleciona todos os campos + nome do médico
      .eq('doctor_id', uid); // Filtra pelo ID do médico

    setSchedule(dataSchedule || []); // Atualiza estado
  }

  // Função para deletar horário
  async function delSchedule(id) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('supra_id', id); // Remove registro pelo ID
  }

  const [inserirAgenda, setInserirAgenda] = useState(false); // Estado para controlar formulário
  const userType = localStorage.getItem('tipoUsuario'); // Pega tipo de usuário
  console.log(userType); // Log para depuração

  return ( // JSX do componente
    <main>
      <div className="alinhamentoPagina">
        {schedule.length === 0 ? ( // Se não houver horários
          <p className="semConsulta">Nenhuma consulta encontrada.</p> // Exibe mensagem
        ) : ( // Se houver horários
          <>
            {userType === "doctor" && ( // Se o usuário for médico
              <div className="addScheduleContainer">
                <button className="addScheduleBtn" onClick={() => setInserirAgenda(!inserirAgenda)}>
                  {inserirAgenda ? "Fechar formulário" : "Adicionar Novo Horário"} {/* Texto do botão muda */}
                </button>

                {inserirAgenda && ( // Formulário de adicionar horário
                  <form className="addScheduleForm" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="date" // Input para data
                      value={schedule.date} // Valor do estado
                      onChange={(e) => setSchedule([{ ...schedule, date: e.target.value }])} // Atualiza estado
                      required
                    />
                    <button type="button" onClick={creatSchedule}> {/* Chama função de criação */}
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
                    <th>Status</th>
                    <th>Avaliação</th>
                    <th>Paciente</th>
                    <th>Pagamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((agenda) => ( // Mapeia cada horário
                    <tr key={agenda.id} className="agendaCard">
                      <td>{agenda.date}</td>
                      <td>{agenda.doctors?.nome}</td>
                      <td>{agenda.status}</td>
                      <td>{agenda.avaliacao}</td>
                      <td>{agenda.patient_id}</td>
                      <td>{agenda.payment_id}</td>
                      <td>
                        {userType === "patient" && agenda.status === "agendada" && ( // Botão só aparece para pacientes
                          <button className="btnCancel" onClick={() => delSchedule(agenda.id)}>
                            Cancelar Consulta
                          </button>
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
    </main>
  );
}

export default Schedule; // Exporta o componente
