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
  const [especialidade, setEspecialidade] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [msg, setMsg] = useState(""); // estado para mensagens de feedback (erro, sucesso)
  const [loading, setLoading] = useState(false); // estado para indicar carregamento
  const [filtroAplicado, setFiltroAplicado] = useState(null);
  const [filtro, setFiltro] = useState("");



  useEffect(() => {
    listarMedicos(); // Chama função para buscar todos os médicos
    listarEspecialidades();
  }, []);

  async function listarEspecialidades() {
    let { data: dataEspecialidade, error } = await supabase
      .from('especialidade')
      .select('*');
    setEspecialidade(dataEspecialidade); // Atualiza estado com resultado filtrado

  }

  async function listarMedicos(filtro = null) {
    setLoading(true);
    setFiltroAplicado(filtro); // salva o filtro aplicado
    setMsg("");

    let dataDoctors = [];
    let error = null;

    if (filtro) {
      const result = await supabase
        .from('doctors')
        .select('*')
        .eq('especialidade_id', filtro);
      dataDoctors = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('doctors')
        .select('*');
      dataDoctors = result.data;
      error = result.error;
    }

    if (error) {
      setDoctors([]);
      setMsg("Ocorreu um erro ao buscar os médicos.");
    } else {
      setDoctors(dataDoctors || []);
      if (filtro && dataDoctors.length === 0) {
        setMsg("Não há médicos cadastrados para esta especialidade.");
      } else {
        setMsg("");
      }
    }

    setLoading(false);
  }


  async function deletarMedico(id) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('supra_id', id);
  }



  async function readSchedule(doctor_id) {

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*') // Seleciona todos os campos
      .order('date', { ascending: true }); // ordena do menor para o maior;
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
            <select
              className="especialidade"
              value={filtro}
              onChange={(e) => {
                const value = e.target.value;
                setFiltro(value);
                listarMedicos(value);
              }}
            >
              <option value="">Selecione uma especialidade</option>
              {especialidade.map(e => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>

            {filtro && (
              <button
                className="btnFiltro"
                onClick={() => {
                  setFiltro("");
                  listarMedicos(); // lista todos
                }}
              >
                Limpar filtro
              </button>
            )}
          </div>
          <div></div>
        </div>

        <div className='apresentacaoPlataforma'>
          <h2>🩺 Bem-vindo ao ConectMed!</h2>
          <p>
            Agende suas consultas médicas por apenas <strong>R$120,00</strong>, com rapidez, praticidade e 100% online.<br />
            Escolha a especialidade, veja os horários disponíveis e marque sua consulta em poucos cliques.
          </p>
          <p><strong>🕐 Sem filas. Sem complicações. Só saúde acessível.</strong></p>
        </div>
      </div>

      {/* Mapeia e exibe cada médico da lista */}

      <div className='alinhamentoPagina'>
        {loading ? (
          <p className="semConsulta">Carregando...</p>
        ) : doctors.length === 0 ? (
          <p className="semConsulta" > Nenhum médico disponível.</p>

        ) : (doctors.map(medico => (
          <div key={medico.id}> {/* Chave única para cada médico */}
            <div className="alinhamentoPagina">

              <div className="cardInfoConsulta">

                <div></div>

                <div className="infoConsulta">
                  <img
                    src={medico.fotoPerfil?.[0]?.url}
                    alt={medico.nome}
                  />
                  {medico.nome}<br />
                  {especialidade.find(e => e.id === medico.especialidade_id)?.nome || 'Sem especialidade'}


                  <Button className='btnVerMais' variant="primary" onClick={() => nav(`/doctors/${medico.supra_id}`, { replace: true })}>Ver mais</Button>
                </div>

                <div className="calendario">

                  <h3>Disponibilidade</h3>
                  <p>Selecione o dia e horário de sua preferência para o atendimento</p>

                  <div className="disponibilidade">

                    <div className="dataDisponivel">

                      {schedule.filter(agenda => agenda.doctor_id === medico.supra_id && agenda.status === "Disponível").length === 0 ? (
                        <p className="semConsulta">Nenhum horário disponível.</p>
                      ) : (
                        schedule
                          .filter(agenda => agenda.doctor_id === medico.supra_id && agenda.status === "Disponível")
                          .map(agenda => (
                            <button key={agenda.id} className="btnData" onClick={() => validarSessao(agenda.id, medico.supra_id)}>
                              {formatarData(agenda.date)}
                            </button>
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

      </div >
    </main>
  );


}

export default Doctor; // Exporta o componente para uso em outros arquivos
