import { useState, useEffect } from 'react'; // Importa hooks do React para gerenciar estado e efeitos
import { useNavigate, useParams } from 'react-router-dom'; // Importa hooks para navegação e para pegar parâmetros da URL
import { createClient } from "@supabase/supabase-js"; // Importa Supabase client

import './doctors.css'; // Importa arquivo de estilos CSS

// Configuração do Supabase
const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"; // URL do projeto Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"; // Chave do projeto Supabase
const supabase = createClient(supabaseUrl, supabaseKey); // Cria cliente Supabase

function Doctor() { // Componente React Doctor
  const nav = useNavigate(); // Hook para navegação programática
  const { id } = useParams(); // Pega o parâmetro 'id' da URL

  // Estado do médico, já inicializado com todas as propriedades
  const [doctor, setDoctor] = useState({ nome: "" });

  const [loading, setLoading] = useState(false); // Estado para loading do botão
  const [msg, setMsg] = useState(""); // Estado para mensagens de sucesso ou erro

  const [especialidade, setEspecialidades] = useState([]);

  async function listarEspecialidades() {
    let { data: dataEspecialidade, error } = await supabase
      .from('especialidade')
      .select('*')
    setEspecialidades(dataEspecialidade); // Atualiza estado com resultado filtrado

  }

  // useEffect que chama a função listarMedicos ao montar o componente
  useEffect(() => {
    listarMedicos();
    listarEspecialidades();
  }, [])

  // Função para atualizar dados do médico
  async function update() {
    setLoading(true); // Ativa loading

    try {
      // 1. Pega usuário logado no Auth
      const { data: dU, error: eU } = await supabase.auth.getUser();
      const uid = dU?.user?.id; // Pega uid do usuário logado

      if (!uid) nav("/user", { replace: true }); // Redireciona caso não exista uid

      // 2. Atualiza dados do médico na tabela 'doctos' (possível erro de digitação, deveria ser 'doctors')
      const { data: edit, error: editError } = await supabase.from("doctors").update([
        {
          email: doctor.email,
          telefone: doctor.telefone,
          residencia: doctor.residencia,
          diploma: doctor.diploma,
          situacaoRegular: doctor.situacaoRegular,
          fotoPerfil: doctor.fotoPerfil,
          especialidade_id: doctor.especialidade_id
        },
      ]).eq('supra_id', id); // Atualiza apenas o médico com o supra_id igual ao id da URL

      if (editError) throw editError; // Lança erro caso ocorra

      setDoctor(edit); // Atualiza estado com dados retornados

      setMsg("Cadastro realizado com sucesso!"); // Mensagem de sucesso

      nav(`/schedule/${uid}`, { replace: true });


    } catch (e) {
      setMsg(`Error: ${e.message}`); // Mensagem de erro
    }

    setLoading(false); // Desativa loading

    setTimeout(() => setMsg(""), 5000); // Limpa mensagem após 5 segundos
  }



  // Função para buscar dados do médico
  async function listarMedicos() {
    let { data: dataDoctors, error } = await supabase
      .from('doctors') // Tabela 'doctors'
      .select('*') // Seleciona todas as colunas
      .eq('supra_id', id) // Filtra pelo supra_id
      .single(); // Retorna apenas um registro
    setDoctor(dataDoctors); // Atualiza estado
  }

  // Função para deslogar
  async function logout() {
    await supabase.auth.signOut();

    // Limpa qualquer dado local (se usado)
    localStorage.clear();
    sessionStorage.clear();

    nav("/user", { replace: true });
    window.location.reload(); // Recarrega a página
  }

   const enviarArquivo = async (e, campo, pasta) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        setLoading(true);
        setMsg("");
  
        const filePath = `${pasta}/${Date.now()}-${file.name}`;
  
        const { error: uploadError } = await supabase.storage
          .from("arquivos_medicos")
          .upload(filePath, file, { upsert: true });
  
        if (uploadError) throw uploadError;
  
        const { data: publicData } = supabase.storage
          .from("arquivos_medicos")
          .getPublicUrl(filePath);
  
        setDoctor(prev => {
          const prevFiles = Array.isArray(prev[campo]) ? prev[campo] : [];
          return {
            ...prev,
            [campo]: [...prevFiles, { name: file.name, url: publicData.publicUrl }]
          };
        });
  
        setMsg("Upload realizado com sucesso!");
      } catch (err) {
        console.error("Erro ao fazer upload:", err.message);
        setMsg(`Erro: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };



  return (
    <main>
      <div className="card"> {/* Card container */}
        {/* Formulário do médico */}
        <form onSubmit={(e) => e.preventDefault()}>

          <h3>Cadastro Médico</h3>

            <p>
              <label>Nome*</label>
              <input id="nome" type="text"  value={doctor.nome} disabled />
            </p>

            <p>
              <label>E-mail*</label>
              <input id="email" type="email" value={doctor.email} onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF*</label>
              <input id="cpf" type="text" value={doctor.cpf}  disabled />
            </p>

            <p>
              <label>Número do CRM*</label>
              <input id="numerodocrm" type="text" value={doctor.numeroCRM}  disabled />
            </p>

            <p>
              <label>UF do CRM*</label>
              <select
                value={doctor.ufCRM}
                
                 disabled
              >
                <option value="">Selecione um estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </p>
            <p>
              <label>Data de Emissão*</label>
              <input id="dataEmissao" type="date" value={doctor.dataEmissaoCRM}  disabled />
            </p>

            <p>
              <label>Telefone*</label>
              <input id="telefone" type="text" value={doctor.telefone} onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} required />
            </p>

            <p>
              <label>Especialidade*</label>
              <select value={doctor.especialidade_id}  disabled>
                <option value="">Selecione uma especialidade</option>
                {especialidade.map(
                  e => (
                    <option key={e.id} value={e.id}>{e.nome}</option>
                  )
                )
                }
              </select>
            </p>

            <p>
              <label>Resumo Profissional*</label>
              <textarea rows="7" id="resumoProfissional" type='text' value={doctor.resumoProfissional} required />
            </p>
            <div className='upload'>

              {/* Comprovante de residência */}
              <p>
                <input type="file" id="uploadResidencia" onChange={(e) => enviarArquivo(e, "residencia", "residencias")} />
                <label htmlFor="uploadResidencia" className="btnUpload">Enviar comprovante de residência*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.residencia?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    
                  </div>
                ))}
              </div>

              {/* Diploma acadêmico */}
              <p>
                <input type="file" id="uploadDiploma" onChange={(e) => enviarArquivo(e, "diploma", "diplomas")} />
                <label htmlFor="uploadDiploma" className="btnUpload">Anexar diploma acadêmico*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.diploma?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    
                  </div>
                ))}
              </div>

              {/* Comprovante de situação regular */}
              <p>
                <input type="file" id="uploadComprovante" onChange={(e) => enviarArquivo(e, "situacaoRegular", "situacaoRegular")} />
                <label htmlFor="uploadComprovante" className="btnUpload">Comprovante de situação regular*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.situacaoRegular?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    
                  </div>
                ))}
              </div>

              {/* Foto de perfil */}
              <p>
                <input type="file" id="uploadFoto" onChange={(e) => enviarArquivo(e, "fotoPerfil", "fotoPerfil")} />
                <label htmlFor="uploadFoto" className="btnUpload">Foto de Perfil*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.fotoPerfil?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    
                  </div>
                ))}
              </div>

            </div>

          <button className="buttonSucess" type="button" onClick={update} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"} {/* Botão que mostra loading */}
          </button>

          <button className="buttonLogout" type="button" onClick={logout}>
            Sair
          </button>

        </form>
      </div>
    </main>
  );
}

export default Doctor; // Exporta o componente
