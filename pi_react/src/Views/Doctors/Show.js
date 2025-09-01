import { useState, useEffect } from 'react'; // Importa hooks do React
import { createClient } from "@supabase/supabase-js"; // Importa client do Supabase
import { useNavigate, useParams } from 'react-router-dom'; // Importa hooks para navegação e parâmetros de URL
import Button from 'react-bootstrap/Button'; // Importa botão do React Bootstrap

import { supabase } from '../../User'; // Importa instância do Supabase

function Doctor() { // Função componente Doctor (JavaScript/React)
  const nav = useNavigate(); // Hook para navegação programática
  const [doctor, setDoctor] = useState(null); // Estado para armazenar dados do médico
  const { id } = useParams(); // Pega o ID do médico a partir da URL

  // useEffect para listar dados do médico ao carregar o componente ou quando id mudar
  useEffect(() => {
    listarMedicos(id)
  }, [id])

  // Função para buscar os dados do médico no Supabase
  async function listarMedicos(id) {
    let { data: dataDoctor, error } = await supabase
      .from('doctors') // Tabela 'doctors'
      .select('*') // Seleciona todas as colunas
      .eq('supra_id', id) // Filtra pelo id do médico
      .single() // Retorna apenas um registro
    setDoctor(dataDoctor); // Atualiza o estado com os dados do médico
  }

  if (!doctor) return <p>Carregando...</p>; // Mostra mensagem enquanto os dados não carregam

  return ( // JSX/HTML retornado pelo componente
    <main>
      <div className="alinhamentoPagina"> {/* Container principal */}
        
        {/* Seção de dados gerais do médico */}
        <div className="dadosGeraisConsulta">
          <div className="apresentacaoMedico">
            <div className="detalhesMedico">

              {/* Descrição e especialidade */}
              <div className="descricaoEspecialidade">
                <h2>{doctor.nome}</h2> {/* Nome do médico */}
                <p>{doctor.especialidade}</p> {/* Especialidade */}
                <p>jvcnjf vnvkjnfdkjnvf vfjdnvjkfd vfjdnvikjfdib vjdfnvjfdnv
                  jf vnvkjnfdkjnvf vfjdnvjkfd v jf vnvkjnfdkjnvf vfjdnvjkfd vjf vnvkjnfdkjnvf vfjdnvjkfd v jf vnvkjnfdkjnvf vfjdnvjkfd v
                </p> {/* Texto de exemplo */}
              </div>

              {/* Imagem do médico */}
              <div className="imgMedico">
                <img src={doctor.imagem}/> {/* URL da imagem do médico */}
              </div>

            </div>
          </div>
        </div>

        {/* Seção de resumo profissional */}
        <div className="experiencia">
          <h3>Resumo Profissional</h3>
          <p>{doctor.resumoProfissional}</p> {/* Texto do resumo profissional */}
        </div>

        {/* Seção de avaliações */}
        <div className="avaliacoes">
          <h3>Avaliações</h3>

          <div className="todasAvaliacoes">

            <div className="avaliacao">
                <p><span id="avaliacaoDescricao"></span><span id="avaliacaoEstrela"></span></p> {/* Descrição e estrelas da avaliação */}
                <p id="pacienteNome"></p> {/* Nome do paciente */}
                <p id="dataConsulta"></p> {/* Data da consulta */}
            </div>

            <a href="#">Ver mais</a> {/* Link para ver mais avaliações */}

          </div>
        </div>

        {/* Seção de disponibilidade do médico */}
        <div className="calendario">
          <h3>Disponibilidade</h3>
          <p>Selecione o dia e horário de sua preferência para o atendimento</p>

          <div className="disponibilidade">
            <div className="dataDisponivel">
              <a className="btn" href=""><span>   </span> às <span>   </span></a> {/* Botão para selecionar horário */}
            </div>
          </div>
        </div>

      </div>
    </main>
  );

}

export default Doctor; // Exporta o componente para uso em outros arquivos
