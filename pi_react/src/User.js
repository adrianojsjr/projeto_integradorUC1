
import { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useLocation } from 'react-router-dom';

import './App.css';
import './user.css';

// informações para conexão com Supabase
const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

export const supabase = createClient(supabaseUrl, supabaseKey); // cria cliente Supabase
const defaultAvatar = "./doctoravatar.svg"; // caminho da imagem padrão de médico

function User() { // componente principal User

  const nav = useNavigate(); //navegar entre telas
  const location = useLocation();

  // estado para os dados do médico no cadastro
  const [doctor, setDoctor] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    numeroCRM: "",
    ufCRM: "",
    dataEmissaoCRM: "",
    especialidade_id: "",
    residencia: [],
    ativo: "",
    fotoPerfil: defaultAvatar,
    diploma: "",
    situacaoRegular: "",
    resumoProfissional: ""
  });

  const [msg, setMsg] = useState(""); // estado para mensagens de feedback (erro, sucesso)

  // estado para os dados do paciente no cadastro
  const [patient, setPatient] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    ativo: ""
  });

  const [especialidade, setEspecialidades] = useState([]);


  useEffect(() => {
    listarEspecialidades();
  }, []);

  const [loading, setLoading] = useState(false); // estado para indicar carregamento

  async function listarEspecialidades() {
    let { data: dataEspecialidade, error } = await supabase
      .from('especialidade')
      .select('*')
    setEspecialidades(dataEspecialidade); // Atualiza estado com resultado filtrado

  }


  // função de cadastro de médico
  async function register() {
    setLoading(true);

    try {
      // cria usuário no Supabase Auth
      let { data, error } = await supabase.auth.signUp({
        email: doctor.email,
        password: doctor.senha
      });
      if (error) throw error
      if (data.status == 400) throw data.message // trata caso o status seja 400

      const uid = data?.user?.id // pega o ID do usuário criado

      // insere dados do médico na tabela "doctors"
      let { data: dD, error: eD } = await supabase
        .from('doctors')
        .insert([
          {
            supra_id: uid,
            nome: doctor.nome,
            email: doctor.email,
            telefone: doctor.telefone,
            cpf: doctor.cpf,
            numeroCRM: doctor.numeroCRM,
            ufCRM: doctor.ufCRM,
            dataEmissaoCRM: doctor.dataEmissaoCRM,
            especialidade_id: doctor.especialidade_id,
            residencia: doctor.residencia,
            diploma: doctor.diploma,
            situacaoRegular: doctor.situacaoRegular,
            resumoProfissional: doctor.resumoProfissional,
            ativo: true
          }
        ]); /* tabela doctors no Supabase */

      if (eD) throw eD; // só continua se não houver erro na inserção

      setMsg("Cadastro realizado! Verifique seu e-mail para confirmar o cadastro."); // feedback
      setTelaLogin(true); // volta para tela de escolha
      let tipoUsuario = "medico";

    } catch (e) {
      setMsg(`Error: ${e.message}`); // mostra mensagem de erro
    }

    setLoading(false);
    setTimeout(() => setMsg(""), 5000); // limpa mensagem depois de 5s
  }

  // função de cadastro de paciente
  async function registerPatient() {
    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: patient.email,
        password: patient.senha
      });
      if (error) throw error
      if (data.status == 400) throw data.message

      const uid = data?.user?.id

      // insere dados do paciente na tabela "patients"
      let { data: dD, error: eD } = await supabase
        .from('patients')
        .insert([
          {
            supra_id: uid,
            email: patient.email,
            telefone: patient.telefone,
            nome: patient.nome,
            cpf: patient.cpf,
            ativo: true
          }
        ]);
      if (eD) throw eD; // só continua se não houver erro

      setMsg("Cadastro realizado! Verifique seu e-mail para confirmar o cadastro."); // feedback
      setTelaLogin(true); // volta para tela de escolha
      let tipoUsuario = "paciente";
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }

    setLoading(false);
    setTimeout(() => setMsg(""), 5000);
  }


  async function logar() {
    setLoading(true)
    try {
      // tenta logar
      let { data, error } = await supabase.auth.signInWithPassword({
        email: doctor.email,
        password: doctor.senha
      });

      const uid = data.user.id;

      let { data: dataDoctor } = await supabase
        .from('doctors')
        .select('*')
        .eq('supra_id', uid)
        .single();

      let tipoUsuario;

      if (dataDoctor) {
        tipoUsuario = 'doctor';



      } else {

        let { data: dataPatient } = await supabase
          .from('patients')
          .select('*')
          .eq('supra_id', uid)
          .single();

        if (dataPatient) tipoUsuario = 'patient';
      }
      if (!tipoUsuario) throw new Error("Usuário não encontrado em nenhuma tabela");

      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('supaSession', data.session);

      // redirecionamento de volta pra tela que escolheu o horário
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        nav(redirect, { replace: true });
      } else {
        if (tipoUsuario === 'doctor') {
          nav(`/doctors/edit/${uid}`, { replace: true });
        } else {
          nav("/doctors", { replace: true });
        }
      }

      setMsg("Login realizado com sucesso!");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
    setLoading(false);
    window.location.reload(); // Recarrega a página
  }

  const enviarArquivo = async (e, campo, pasta) => {

    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMsg("");

      // Pega o usuário logado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        setMsg("Usuário não logado!");
        return;
      }

      const uid = userData.user.id;

      // Define caminho único no bucket
      const filePath = `${pasta}/${uid}-${Date.now()}-${file.name}`;

      // Faz upload para o bucket "arquivos_medicos"
      const { error: uploadError } = await supabase.storage
        .from("arquivos_medicos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Pega a URL pública do arquivo
      const { data: publicData } = supabase.storage
        .from("arquivos_medicos")
        .getPublicUrl(filePath);

      // Atualiza o estado do doctor com a URL do arquivo
      setDoctor(prev => ({ ...prev, [campo]: publicData.publicUrl }));
      setMsg("Upload realizado com sucesso!");

    } catch (err) {
      console.error("Erro ao fazer upload:", err.message);
      setMsg(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // esconde telas
  const [telaLogin, setTelaLogin] = useState(true);
  const [souMedico, setSouMedico] = useState(false);


  return (
    <main className="App">


      <div className="card">


        {!telaLogin && souMedico && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="beneficiosMedico">
              <h2>Seja bem-vindo à nossa plataforma!</h2>
              <p>Ao se cadastrar como médico, você terá acesso a uma série de vantagens:</p>
              <ul>
                <li>Divulgue sua agenda de forma simples e prática: basta cadastrar seus horários disponíveis.</li>
                <li>Receba pacientes diretamente pela plataforma, com agendamentos automáticos na sua agenda.</li>
                <li>Cada consulta tem duração padrão de 20 minutos, garantindo organização e produtividade.</li>
                <li>O valor da consulta é de R$ 60,00, com recebimento líquido de R$ 42,00 por atendimento (70%).</li>
                <li>Em apenas 1 hora você pode atender até 3 pacientes e faturar R$ 126,00 líquidos.</li>
              </ul>
              <p>Cadastre-se agora e comece a atender online de forma rápida, prática e sem burocracia.</p>
            </div>
            <h3>Cadastro Médico</h3>

            <p>
              <label>Nome</label>
              <input id="nome" type="text" placeholder="Nome do titular" onChange={(e) => setDoctor({ ...doctor, nome: e.target.value })} />
            </p>

            <p>
              <label>E-mail</label>
              <input id="email" type="email" placeholder="exemplo@email.com" onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF</label>
              <input id="cpf" type="text" placeholder="000.000.000-00" onChange={(e) => setDoctor({ ...doctor, cpf: e.target.value })} />
            </p>

            <p>
              <label>Número do CRM</label>
              <input id="numerodocrm" type="text" placeholder="CRM" onChange={(e) => setDoctor({ ...doctor, numeroCRM: e.target.value })} />
            </p>

            <p>
              <label>UF do CRM</label>
              <input id="ufdocrm" type="text" placeholder="Insira o UF do CRM" onChange={(e) => setDoctor({ ...doctor, ufCRM: e.target.value })} />
            </p>

            <p>
              <label>Data de Emissão</label>
              <input id="dataEmissao" type="date" onChange={(e) => setDoctor({ ...doctor, dataEmissaoCRM: e.target.value })} />
            </p>

            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone" onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} />
            </p>

            <p>
              <label>Especialidade*</label>
              <select value={doctor.especialidade_id} onChange={(e) => setDoctor({ ...doctor, especialidade_id: e.target.value })} required>
                {especialidade.map(
                  e => (
                    <option key={e.id} value={e.id}>{e.nome}</option>
                  )
                )
                }
              </select>
            </p>

            <p>
              <label>Resumo Profissional</label>
              <textarea rows="7" id="resumoProfissional" type='text' onChange={(e) => setDoctor({ ...doctor, resumoProfissional: e.target.value })} />
            </p>

            <div className='upload'>
              <p>
                <input type="file" id="uploadResidencia" onChange={(e) => enviarArquivo(e, "residencia", "residencias")} />
                <label htmlFor="uploadResidencia" className="btnUpload">Enviar comprovante de residência</label>

              </p>

              <p>
                <input type="file" id="uploadDiploma" onChange={(e) => enviarArquivo(e, "diploma", "diplomas")} />
                <label htmlFor="uploadDiploma" className="btnUpload">Anexar diploma acadêmico*</label>
              </p>

              <p>
                <input type="file" id="uploadComprovante" onChange={(e) => enviarArquivo(e, "situacaoRegular", "situacaoRegular")} />
                <label htmlFor="uploadComprovante" className="btnUpload">Comprovante de situação regular*</label>
              </p>

              <p>
                <input type="file" id="uploadFoto" onChange={(e) => enviarArquivo(e, "fotoPerfil", "fotoPerfil")} />
                <label htmlFor="uploadFoto" className="btnUpload">Foto de Perfil*</label>
              </p>

            </div>

            <p>
              <label>Senha</label>
              <input id="password" type="password" onChange={(e) => setDoctor({ ...doctor, senha: e.target.value })} required />
            </p>

            <button className="buttonSucess" type="button" onClick={register} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        )}


        {!telaLogin && !souMedico && (
          <form onSubmit={(e) => e.preventDefault()} title='Cadastro Paciente'>
            <h3>Cadastro Paciente</h3>
            <p>
              <label>Nome</label>
              <input id="nome" type="text" placeholder="Nome do titular" onChange={(e) => setPatient({ ...patient, nome: e.target.value })} required />
            </p>

            <p>
              <label>E-mail</label>
              <input id="email" type="email" placeholder="exemplo@email.com" onChange={(e) => setPatient({ ...patient, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF</label>
              <input id="cpf" type="text" placeholder="000.000.000-00" onChange={(e) => setPatient({ ...patient, cpf: e.target.value })} required />
            </p>


            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone" onChange={(e) => setPatient({ ...patient, telefone: e.target.value })} required />
            </p>

            <p>
              <label>Senha</label>
              <input id="senha" type="password" onChange={(e) => setPatient({ ...patient, senha: e.target.value })} required />
            </p>

            <button className="buttonSucess" type="button" onClick={registerPatient} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        )}

        {telaLogin && (
          <form onSubmit={(e) => e.preventDefault()}>

            <p>Para logar coloque as informações abaixo</p>
            <input type='email' placeholder='Digite seu email' onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} />
            <br />
            <br />
            <input type='password' placeholder='Digite sua senha' onChange={(e) => setDoctor({ ...doctor, senha: e.target.value })} />
            <button
              type="button" className="buttonSucess" onClick={logar} disabled={loading} >
              {loading ? "Entrando..." : "Login"}
            </button>

          </form>
        )}

        <div >

          {telaLogin && (
            <>
              <p className='txtCadastrar'>Cadastre-se</p>
              <div className="btnMedicoPaciente">
                <button onClick={() => { setTelaLogin(false); setSouMedico(true) }}>Sou médico</button>
                <button onClick={() => { setTelaLogin(false); setSouMedico(false) }} >Sou paciente</button>
              </div>
            </>
          )}
          {!telaLogin && (
            <button onClick={() => setTelaLogin(!telaLogin)}>Voltar para Login</button>
          )}


        </div>


      </div>
      {msg && (<div className='toast'>{msg}</div>)}


    </main>
  );

}

export default User;
