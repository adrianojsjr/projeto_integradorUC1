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
  const [doctor, setDoctor] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    numeroCRM: "",
    ufCRM: "",
    dataEmissaoCRM: "",
    especialidade: "",
    residencia: [],
    ativo: "",
    imagem: "",
    diploma: "",
    situacaoRegular: "",
    disponibilidade: [],
    fotoPerfil: ""
  });

  const [loading, setLoading] = useState(false); // Estado para loading do botão
  const [msg, setMsg] = useState(""); // Estado para mensagens de sucesso ou erro

  // useEffect que chama a função listarMedicos ao montar o componente
  useEffect(() => {
    listarMedicos()
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
          supra_id: uid,
          nome: doctor.nome,
          email: doctor.email,
          telefone: doctor.telefone,
          cpf: doctor.cpf,
          numeroCRM: doctor.numeroCRM,
          ufCRM: doctor.ufCRM,
          dataEmissaoCRM: doctor.dataEmissaoCRM,
          especialidade: doctor.especialidade,
          residencia: doctor.residencia,
          diploma: doctor.diploma,
          situacaoRegular: doctor.situacaoRegular,
          ativo: true,
          fotoPerfil: doctor.fotoPerfil
        },
      ]).eq('supra_id', id); // Atualiza apenas o médico com o supra_id igual ao id da URL

      if (editError) throw editError; // Lança erro caso ocorra

      setDoctor(edit); // Atualiza estado com dados retornados

      setMsg("Cadastro realizado com sucesso!"); // Mensagem de sucesso

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

  // Função para enviar arquivo para Supabase e retornar a URL pública
  async function enviarArquivoSupabase(file, path) {
    const { data, error } = await supabase.storage
      .from("Arquivos")
      .upload(path, file, { upsert: true });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("Arquivos")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  }

  // Função genérica de upload de arquivos que atualiza o estado
  async function handleFileUpload(e, campoEstado, state, setState, pasta) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const arquivosUpload = await Promise.all(
      files.map(async (file) => {
        const url = await enviarArquivoSupabase(file, `${pasta}/${file.name}`);
        return { nome: file.name, url };
      })
    );

    setState({
      ...state,
      [campoEstado]: [...(state[campoEstado] || []), ...arquivosUpload],
    });
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



  return (
    <main>
      <div className="card"> {/* Card container */}
        {/* Formulário do médico */}
        <form onSubmit={(e) => e.preventDefault()}>

          <p>
            <label>Nome</label>
            <input id="nome" type="text" value={doctor.nome} placeholder="Nome do titular" onChange={(e) => setDoctor({ ...doctor, nome: e.target.value })} />
          </p>

          <p>
            <label>E-mail</label>
            <input id="email" type="email" value={doctor.email} placeholder="exemplo@email.com" onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
          </p>

          <p>
            <label>CPF</label>
            <input id="cpf" type="text" value={doctor.cpf} placeholder="000.000.000-00" onChange={(e) => setDoctor({ ...doctor, cpf: e.target.value })} />
          </p>

          <p>
            <label>Número do CRM</label>
            <input id="numerodocrm" type="text" value={doctor.numeroCRM} placeholder="CRM" onChange={(e) => setDoctor({ ...doctor, numeroCRM: e.target.value })} />
          </p>

          <p>
            <label>UF do CRM</label>
            <input id="ufdocrm" type="text" value={doctor.ufCRM} placeholder="Insira o UF do CRM" onChange={(e) => setDoctor({ ...doctor, ufCRM: e.target.value })} />
          </p>

          <p>
            <label>Telefone</label>
            <input id="telefone" type="text" value={doctor.telefone} placeholder="Insira o Telefone" onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} />
          </p>

          <p>
            <label>Especialidade</label>
            <input id="especialidade" type="text" value={doctor.especialidade} placeholder="Digite a especialidade" onChange={(e) => setDoctor({ ...doctor, especialidade: e.target.value })} />
          </p>

          <p>
            <label>Data de Emissão</label>
            <input id="dataEmissao" type="date" value={doctor.dataEmissaoCRM} onChange={(e) => setDoctor({ ...doctor, dataEmissaoCRM: e.target.value })} />
          </p>


          <div>
            <p>
              <label className="btnUpload">Anexar residência médica*</label>
              <input id="residencia" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, residencia: e.target.value })} required/>
            </p>

            <p>
              <label className="btnUpload">Anexar diploma acadêmico*</label>
              <input id="diploma" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, diploma: e.target.value })} required/>
            </p>

            <p>
              <label className="btnUpload">Comprovante de situação regular*</label>
              <input id="comprovante" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, situacaoRegular: e.target.value })} required />
            </p>

            <p>
              <label className="btnUpload">Foto de Perfil*</label>
              <input id="foto" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, fotoPerfil: e.target.value })} required />
            </p>

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
