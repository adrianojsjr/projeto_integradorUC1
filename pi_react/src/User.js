import logo from './logo.svg';
import './App.css';
import './cadastroMedico.css'
import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';

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
    ativo: "",
    imagem: ""
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
        nav("./doctor", {replace: true}),
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

      setMsg("Cadastro realizado!");
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }

    setLoading(false);

    setTimeout(() => setMsg(""), 5000);
  }




  //esconder telas
  const [telaLogin, setTelaLogin] = useState(true);

  return ( //html
    <main className="App">


      <div class="card">
        {/* formulário de cadastro com o campo para email, senha e um botão para enviar */}

        {!telaLogin && (
          <form className="cadastroMedico">

            <p>
              <label htmlFor="nome">Nome do Médico</label><br />
              <input id="nome" type="text" placeholder="Nome do titular" />
            </p>

            <p>
              <label htmlFor="email">E-mail</label><br />
              <input id="email" type="email" placeholder="exemplo@email.com" onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />

            </p>

            <p>
              <label htmlFor="password">Senha</label><br />
              <input id="email" type="password" onChange={(e) => setDoctor({ ...doctor, password: e.target.value })} required />

            </p>
            <p>
              <label htmlFor="cpf">CPF</label><br />
              <input id="cpf" type="number" placeholder="000.000.000-00" />
            </p>

            <p>
              <label htmlFor="numerodocrm">Número do CRM</label><br />
              <input id="numerodocrm" type="number" placeholder="CRM" />
            </p>

            <p>
              <label htmlFor="ufdocrm">UF do CRM</label><br />
              <input id="ufdocrm" type="text" placeholder="Insira o UF do CRM" />
            </p>

            <p>
              <label htmlFor="telefone">Telefone</label><br />
              <input id="telefone" type="number" placeholder="Insira o Telefone" />
            </p>

            <p>
              <label htmlFor="especialidade">Especialidade</label><br />
              <input id="especialidade" type="text" placeholder="Digite a especialidade" />
            </p>

            <p>
              <label htmlFor="dataEmissao">Data de Emissão</label><br />
              <input id="dataEmissao" type="date" />
            </p>

            <div>
              <p>
                <label htmlFor="residencia" className="upload-btn">Anexar residência médica</label><br />
                <input id="residencia" type="file" name="arquivo" />
              </p>

              <p>
                <label htmlFor="diploma" className="upload-btn">Anexar diploma acadêmico</label><br />
                <input id="diploma" type="file" name="arquivo" />
              </p>

              <p>
                <label htmlFor="comprovante" className="upload-btn">Comprovante de situação regular</label><br />
                <input id="comprovante" type="file" name="arquivo" />
              </p>
            </div>
            <button
              type="button"
              className="buttonSucess"
              onClick={register}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        )}

        {/* {!telaLogin && (
          <form className="cadastroPaciente">

            <p>
              <label htmlFor="nome">Nome</label><br />
              <input id="nome" type="text" placeholder="Nome do titular" required />
            </p>

            <p>
              <label htmlFor="email">E-mail</label><br />
              <input id="email" type="email" placeholder="exemplo@email.com" required />
            </p>

            <p>
              <label htmlFor="cpf">CPF</label><br />
              <input id="cpf" type="number" placeholder="000.000.000-00" required />
            </p>


            <p>
              <label htmlFor="telefone">Telefone</label><br />
              <input id="telefone" type="number" placeholder="Insira o Telefone" required />
            </p>

            <p>
              <label htmlFor="endereco">Endereço</label><br />
              <input id="endereco" required />
            </p>

            <p>
              <label htmlFor="senha">Senha</label><br />
              <input id="senha" required />
            </p>

          </form>
        )} */}


        {/* formulário de login com o campo para email, senha e um botão para enviar */}

        {telaLogin && (
          <form className='login'>
            <p>Para logar coloque as informações abaixo</p>

            <label>Digite o email
              <input type='email' placeholder='exemplo@exemplo.com' onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} />
            </label>

            <br />
            <br />

            <label>Digite a senha
              <input type='password' placeholder='senha' onChange={(e) =>  setDoctor({ ...doctor, senha: e.target.value })} /><br />
            </label>

            <br />


            <button
              type="button" className="buttonSucess" onClick={logar} disabled={loading} >
              {loading ? "Entrando..." : "Login"}
            </button>

          </form>


        )}


        <button class="btn" onClick={() => setTelaLogin(!telaLogin)}>
          {telaLogin && ("Cadastrar-se")}
          {!telaLogin && ("Login")}
        </button>

      </div>
      {msg && (<div className='toast'>{msg}</div>)}
    </main>
  );

}

export default User;
