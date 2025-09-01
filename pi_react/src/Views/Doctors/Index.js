import { useState, useEffect } from 'react'; // Importa hooks do React
import { createClient } from "@supabase/supabase-js"; // Importa client do Supabase
import { useNavigate } from 'react-router-dom'; // Importa hook para navegação
import Button from 'react-bootstrap/Button'; // Importa botão do React Bootstrap

import './Style.css'; // Importa arquivo de estilos CSS

// Configuração do Supabase
const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"; // URL do projeto Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"; // Chave de API (não segura para produção)

const supabase = createClient(supabaseUrl, supabaseKey); // Cria cliente Supabase

function Doctor() { // Componente React Doctor
  const nav = useNavigate(); // Hook para navegação programática
  const [doctors, setDoctors] = useState([]); // Estado para armazenar lista de médicos

  // useEffect para listar médicos ao montar o componente
  useEffect(() => {
    listarMedicos(); // Chama função para buscar todos os médicos
  }, []);

  // Função para listar médicos, com opção de filtro por especialidade
  async function listarMedicos(filtro = null) {
    if (filtro) { // Se houver filtro
      let { data: dataDoctors, error } = await supabase
        .from('doctors') // Tabela 'doctors'
        .select('*') // Seleciona todas as colunas
        .eq('especialidade', filtro); // Filtra pela especialidade
      setDoctors(dataDoctors); // Atualiza estado com resultado filtrado
    } else { // Se não houver filtro, busca todos os médicos
      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*');
      setDoctors(dataDoctors); // Atualiza estado com todos os médicos
    }
  }

  // Função para deletar médico pelo supra_id
  async function deletarMedico(id) {
    const { error } = await supabase
      .from('doctors') // Tabela 'doctors'
      .delete() // Deleta registro
      .eq('supra_id', id); // Filtra pelo id
  }

  return ( // JSX/HTML do componente
    <main>
      <div className="inicio"> {/* Container inicial da página */}
        <div className="menuBusca"> {/* Menu de busca e filtros */}
          <div></div> {/* Espaçamento vazio */}
          <div className="busca"> {/* Campo de busca e botões de filtro */}
            <input type="text" placeholder="Especialidade ou médico" /> {/* Input de pesquisa */}
            <button className="btn" onClick={() => listarMedicos("Dermatologista")}>Dermatologista</button> {/* Filtro Dermatologista */}
            <button className="btn" onClick={() => listarMedicos("Cardiologista")}>Cardiologista</button> {/* Filtro Cardiologista */}
            <button className="btn" onClick={() => listarMedicos("Endocrinologista")}>Endocrinologista</button> {/* Filtro Endocrinologista */}
            <button className="btn" onClick={() => listarMedicos()}>Buscar Todos</button> {/* Botão para buscar todos */}
          </div>
          <div></div> {/* Espaçamento vazio */}
        </div>
      </div>

      {/* Mapeia e exibe cada médico da lista */}
      {doctors.map(medico => (
        <div key={medico.supra_id}> {/* Chave única para cada médico */}
          <div className="alinhamentoPagina"> {/* Container de alinhamento */}

            <div className="cardInfoConsulta"> {/* Card de informações do médico */}

              <div>
                <img src={medico.imagem} /> {/* Imagem do médico */}
                {medico.nome}<br /> {/* Nome do médico */}
                {medico.especialidade} {/* Especialidade */}
                {/* Botão para navegar para a página de detalhes do médico */}
                <Button variant="primary" onClick={() => nav(`/doctors/${medico.supra_id}`, { replace: true })}>Ver</Button>
              </div>

            </div>

          </div>
        </div>
      ))}

    </main>
  );

}

export default Doctor; // Exporta o componente para uso em outros arquivos
