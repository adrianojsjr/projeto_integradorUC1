import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { supabase } from '../../User';

function Doctor() {

  const nav = useNavigate();
  const [doctor, setDoctor] = useState(null); // Estado para armazenar dados do médico
  const { id } = useParams(); // Pega o ID do médico a partir da URL
  const [schedule, setSchedule] = useState([]);
  const [msg, setMsg] = useState("");

  // useEffect para listar dados do médico ao carregar o componente ou quando id mudar
  useEffect(() => {
    listarMedicos(id);
    readSchedule();
  }, [id])



  async function listarMedicos(id) {
    let { data: dataDoctor, error } = await supabase
      .from('doctors')
      .select(` *, especialidade(nome, descricao)`)
      .eq('supra_id', id)
      .single()
    setDoctor(dataDoctor); // Atualiza o estado com os dados do médico
  }

  if (!doctor) return <p>Carregando...</p>;

  async function readSchedule(doctor_id) {

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*') // Seleciona todos os campos
      .order('date', { ascending: true }); // ordena do menor para o maior;
    setSchedule(dataSchedule || []); // Atualiza estado

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

  const validarSessao = async (agendaID, doctorID) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;

    if (!uid) {
      // Salva a rota atual para voltar depois do login
      const redirect = encodeURIComponent(window.location.pathname);
      nav(`/user?redirect=${redirect}`, { replace: true });
      return;
    }

    nav(`/payment/create/?scheduleId=${agendaID}&doctorId=${doctorID}`);
  };



  return (
      <div className="alinhamentoPagina">


        <div className="dadosGeraisConsulta">

            <div className="detalhesMedico">

              <div className="descricaoEspecialidade">
                <h2>{doctor.nome}</h2>
                <p>{doctor.especialidade?.nome}</p>
                <p>{doctor.especialidade?.descricao}</p>
              </div>

              <div>
                <img src={doctor.fotoPerfil} />
              </div>

            </div>

          <div className="experiencia">
            <h3>Resumo Profissional</h3>
            <p>{doctor.resumoProfissional}</p>
          </div>

          <div className="calendario">

            <h3>Disponibilidade</h3>
            <p>Selecione o dia e horário de sua preferência para o atendimento</p>

            <div>

              <div className="dataDisponivel">

                {schedule.filter(agenda => agenda.doctor_id === doctor.supra_id).length === 0 ? (
                  <p className="semConsulta">Nenhum horário disponível.</p>
                ) : (
                  schedule
                    .filter(agenda => agenda.doctor_id === doctor.supra_id)
                    .map(agenda => (
                      <button key={agenda.id} className="btnData" onClick={validarSessao}>{formatarData(agenda.date)} </button>
                    ))
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

  );
}

export default Doctor; 
