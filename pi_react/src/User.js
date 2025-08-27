
import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';

import './App.css';
import './User.css';
import './StyleGeral.css';

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

export const supabase = createClient(supabaseUrl, supabaseKey);


function User() { //javaScript

  const nav = useNavigate();

  //inserir todos os campos que tem na tela de cadatro
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
    disponibilidade: []
  });

  const [msg, setMsg] = useState("");

  //inserir todos os campos que tem na tela de cadatro
  const [patient, setPatient] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    endereco: "",
    ativo: ""
  });


  const [loading, setLoading] = useState(false);

  async function logar() {

    setLoading(true)

    try {

      let { data, error } = await supabase.auth.signInWithPassword({  //data retorna sucesso

        email: doctor.email,
        password: doctor.senha
      });

      if (error) throw error

      setMsg("Logou") //assim que logar aparece a mensagem e logo em seguida navega para tela principal
      localStorage.setItem('supaSession', data.session) //setItem -> guardar o item

      setTimeout(
        nav("/doctors", { replace: true }),
        5002//aqui navega para tela principal
      );

    } catch (err) {
      setMsg("Error: " + err);

    }

    setLoading(false)

  }

  async function register() {
    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: doctor.email,
        password: doctor.password
      })

      if (error) throw error

      if (data.status == 400) throw data.message

      const uid = data?.user?.id

      let send = {...doctor, supra_id: uid}

      let { data: dD, error: eD } = await supabase.from('doctors').insert(send); /*doctors é o nome da tabela no supabase*/

      setMsg("Cadastro realizado!");
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }

    setLoading(false);

    setTimeout(() => setMsg(""), 5000);
  }

    async function registerPatient() {
    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: patient.email,
        password: patient.password
      })

      if (error) throw error

      if (data.status == 400) throw data.message

      setMsg("Cadastro realizado!");
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }

    setLoading(false);

    setTimeout(() => setMsg(""), 5000);
  }

  


  //esconder telas
  const [telaLogin, setTelaLogin] = useState(true);
  const [souMedico, setSouMedico] = useState(false);

  return ( //html
    <main className="App">


      <div class="card">
        {/* formulário de cadastro com o campo para email, senha e um botão para enviar */}

        {!telaLogin && souMedico &&(
          <form onSubmit={(e) => e.preventDefault()}>

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
              <label>Telefone</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone" onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} />
            </p>

            <p>
              <label>Especialidade</label>
              <input id="especialidade" type="text" placeholder="Digite a especialidade" onChange={(e) => setDoctor({ ...doctor, especialidade: e.target.value })} />
            </p>

            <p>
              <label>Data de Emissão</label>
              <input id="dataEmissao" type="date" onChange={(e) => setDoctor({ ...doctor, dataEmissaoCRM: e.target.value })} />
            </p>

            <div>
              <p>
                <label className="btnUpload">Anexar residência médica</label>
                <input id="residencia" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, residencia: e.target.value })} />
              </p>

              <p>
                <label className="btnUpload">Anexar diploma acadêmico</label>
                <input id="diploma" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, diploma: e.target.value })} />
              </p>

              <p>
                <label className="btnUpload">Comprovante de situação regular</label>
                <input id="comprovante" type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, situacaoRegular: e.target.value })} />
              </p>
            </div>

            <p>
              <label>Senha</label>
              <input id="password" type="password" onChange={(e) => setDoctor({ ...doctor, password: e.target.value })} required />
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
              <input id="email" type="email" placeholder="exemplo@email.com"  onChange={(e) => setPatient({ ...patient, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF</label>
              <input id="cpf" type="text" placeholder="000.000.000-00"  onChange={(e) => setPatient({ ...patient, cpf: e.target.value })} required />
            </p>


            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone"  onChange={(e) => setPatient({ ...patient, telefone: e.target.value })} required />
            </p>

            <p>
              <label>Senha</label>
              <input id="senha" type="password"  onChange={(e) => setPatient({ ...patient, senha: e.target.value })} required />
            </p>

             <button className="buttonSucess" type="button" onClick={registerPatient} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        )}


        {/* formulário de login com o campo para email, senha e um botão para enviar */}

        {telaLogin && (
          <form onSubmit={(e) => e.preventDefault()}>

            <p>Para logar coloque as informações abaixo</p>
            <input type='email' placeholder='Digite seu email' onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} />
            <br/>
            <br/>
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
                <button onClick = {() => {setTelaLogin(false); setSouMedico(true)}}>Sou médico</button>
                <button onClick = {() => {setTelaLogin(false); setSouMedico(false)}} >Sou paciente</button>
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
