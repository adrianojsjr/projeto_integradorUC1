import { useState, useEffect } from 'react'; // Importa hooks do React
import { createClient } from "@supabase/supabase-js"; // Importa client do Supabase
import { useNavigate } from 'react-router-dom'; // Importa hook para navegação
import Button from 'react-bootstrap/Button'; // Importa botão do React Bootstrap
import Schedule from '../Schedule/Index'; // caminho do arquivo do componente Schedule

import './doctors.css'; // Importa arquivo de estilos CSS
import { Input } from '../../Components/input'


// Configuração do Supabase
const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"; // URL do projeto Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"; // Chave de API (não segura para produção)

const supabase = createClient(supabaseUrl, supabaseKey); // Cria cliente Supabase

function Doctor() {
  const nav = useNavigate();
  const [doctors, setDoctors] = useState([]);


  useEffect(() => {
    listarMedicos(); // Chama função para buscar todos os médicos
  }, []);


  async function listarMedicos(filtro = null) {
    if (filtro) {
      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*')

        .eq('especialidade', filtro);
      setDoctors(dataDoctors); // Atualiza estado com resultado filtrado
    } else { // Se não houver filtro, busca todos os médicos
      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*');

      setDoctors(dataDoctors); // Atualiza estado com todos os médicos
    }
  }


  async function deletarMedico(id) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('supra_id', id);
  }

  const [schedule, setSchedule] = useState([]);
  const [msg, setMsg] = useState(""); // estado para mensagens de feedback (erro, sucesso)

  async function readSchedule(doctor_id) {

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*') // Seleciona todos os campos

    setSchedule(dataSchedule || []); // Atualiza estado

  }

  useEffect(() => {
    readSchedule();
  }, []);

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
    <main>
      <div className="inicio">
        <div className="menuBusca">
          <div></div>
          <div className="busca">
            <select className="especialidade" onChange={(e) => listarMedicos(e.target.value)} required>
              <option value="">Selecione uma especialidade</option>
              <option value="Alergologia">Alergologia</option>
              <option value="Cardiologia">Cardiologia</option>
              <option value="Clínica Médica">Clínica Médica</option>
              <option value="Dermatologista">Dermatologia</option>
              <option value="Endocrinologia">Endocrinologia e Metabologia</option>
              <option value="Gastroenterologia">Gastroenterologia</option>
              <option value="Geriatria">Geriatria</option>
              <option value="Ginecologista">Ginecologia</option>
              <option value="Infectologia">Infectologia</option>
              <option value="Medicina de Família">Medicina de Família e Comunidade</option>
              <option value="Neurologia">Neurologia</option>
              <option value="Nutrologia">Nutrologia</option>
              <option value="Oftalmologista">Oftalmologia</option>
              <option value="Pediatria">Pediatria</option>
              <option value="Psiquiatria">Psiquiatria</option>
              <option value="Psicologia">Psicologia</option>
              <option value="Reumatologia">Reumatologia</option>
              <option value="Urologista">Urologia</option>
            </select>
          </div>
          <div></div>
        </div>
      </div>

      {/* Mapeia e exibe cada médico da lista */}


      {doctors.length === 0 ? (
        <div className="alinhamentoPagina">
          <p className="semConsulta">Nenhum médico disponível.</p>
        </div>
      ) : (doctors.map(medico => (
            <div key={medico.supra_id}> {/* Chave única para cada médico */}
              <div className="alinhamentoPagina">

                <div className="cardInfoConsulta">

                  <div></div>

                  <div className="infoConsulta">
                    <img src={medico.imagem} />
                    {medico.nome}<br />
                    {medico.especialidade}
                    <Button className='btnVerMais' variant="primary" onClick={() => nav(`/doctors/${medico.supra_id}`, { replace: true })}>Ver mais</Button>
                  </div>

                  <div className="calendario">

                    <h3>Disponibilidade</h3>
                    <p>Selecione o dia e horário de sua preferência para o atendimento</p>

                    <div className="disponibilidade">

                      <div className="dataDisponivel">

                        {schedule.filter(agenda => agenda.doctor_id === medico.supra_id).length === 0 ? (
                          <p className="semConsulta">Nenhum horário disponível.</p>
                        ) : (
                          schedule
                            .filter(agenda => agenda.doctor_id === medico.supra_id)
                            .map(agenda => (
                              <button key={agenda.id} className="btnData" onClick={() => validarSessao(agenda.id, medico.supra_id)}> {formatarData(agenda.date)} </button>
                            ))
                        )}

                      </div>

                    </div>

                  </div>

                  <div></div>

                </div>

              </div>
            </div>
          ))
        )}

    </main >
  );

}

export default Doctor; // Exporta o componente para uso em outros arquivos
