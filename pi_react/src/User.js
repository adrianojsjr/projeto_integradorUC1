
import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useLocation } from 'react-router-dom';
import {Input} from './Components/input.js';
import './App.css';
import './User.css';

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
    especialidade: "",
    residencia: [],
    ativo: "",
    imagem: defaultAvatar,
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


  const [loading, setLoading] = useState(false); // estado para indicar carregamento

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
            especialidade: doctor.especialidade,
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
    setLoading(true) // ativa indicador de carregamento
    try {
      // tenta logar usando Supabase Auth
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
          nav("/schedule", { replace: true });
        } else {
          nav("/doctors", { replace: true });
        }
      }

      setMsg("Login realizado com sucesso!");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
    setLoading(false);
  }

  // esconde telas
  const [telaLogin, setTelaLogin] = useState(true);
  const [souMedico, setSouMedico] = useState(false);


  return (
    <main className="App">


      <div class="card">


        {!telaLogin && souMedico && (
          <form onSubmit={(e) => e.preventDefault()}>

            <p>
              <input label="Nome" id="nome" type="text" placeholder="Nome do titular" onChange={setDoctor} objeto={doctor} campo='nome'  required />
            </p>

            <p>
              <input id="email" label="Email" type="email" placeholder="exemplo@email.com" onChange={setDoctor} objeto={doctor} campo='email' required />
            </p>

            <p>
              <input id="cpf" label="CPF" type="text" placeholder="000.000.000-00" onChange={setDoctor} objeto={doctor} campo='cpf' required />
            </p>

            <p>
              <input id="numerodocrm" label="Número do CRM" type="text" placeholder="CRM" onChange={setDoctor} objeto={doctor} campo='numeroCRM' required />
            </p>

            <p>
              <input id="ufdocrm" type="text"  label="UF do CRM" placeholder="Insira o UF do CRM" onChange={setDoctor} objeto={doctor} campo='ufCRM' required />
            </p>

            <p>
              <input id="dataEmissao" type="date"  label="Data de Emissão" onChange={setDoctor} objeto={doctor} campo='dataEmissao' required  />
            </p>

            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" label="Telefone" placeholder="Insira o Telefone" onChange={setDoctor} objeto={doctor} campo='telefone' required />
            </p>

            <p>
              <label className="especialidade">Especialidade</label>
              <select
                id="especialidade" onChange={(e) => setDoctor({ ...doctor, especialidade: e.target.value })}>
                <option value="">Selecione uma especialidade</option>
                <option value="alergologia">Alergologia</option>
                <option value="cardiologia">Cardiologia</option>
                <option value="clínica_medica">Clínica Médica</option>
                <option value="dermatologia">Dermatologia</option>
                <option value="endocrinologia">Endocrinologia e Metabologia</option>
                <option value="gastroenterologia">Gastroenterologia</option>
                <option value="geriatria">Geriatria</option>
                <option value="ginecologia">Ginecologia (consultas iniciais e de acompanhamento)</option>
                <option value="infectologia">Infectologia</option>
                <option value="medicina_de_familia">Medicina de Família e Comunidade</option>
                <option value="neurologia">Neurologia</option>
                <option value="nutrologia">Nutrologia</option>
                <option value="oftalmologia">Oftalmologia (triagem e acompanhamento)</option>
                <option value="pediatria">Pediatria</option>
                <option value="psiquiatria">Psiquiatria</option>
                <option value="psicologia">Psicologia</option>
                <option value="reumatologia">Reumatologia</option>
                <option value="urologia">Urologia (avaliações e retornos)</option>
              </select>


            </p>

            <p>
              <label>Resumo Profissional</label>
              <textarea id="resumoProfissional" type='text' onChange={(e) => setDoctor({ ...doctor, resumoProfissional: e.target.value })} />
            </p>

            <div>
              <p>
                <label className="btnUpload">Anexar residência médica</label>
                <input id="residencia" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, residencia: e.target.type })} />
              </p>

              <p>
                <label className="btnUpload">Anexar diploma acadêmico</label>
                <input id="diploma" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, diploma: e.target.file })} />
              </p>

              <p>
                <label className="btnUpload">Comprovante de situação regular</label>
                <input id="comprovante" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, situacaoRegular: e.target.value })} />
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
          <form onSubmit={(e) => e.preventDefault()}>

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

        <div className="btnCadLogin">

          {telaLogin && (
            <>
              <p className='txtCadastrar'>Cadastre-se</p>
              <div>
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
