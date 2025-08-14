import logo from './logo.svg';
import './App.css';
import { use, useState } from 'react';

function App() { //javaScript

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

  const [payment, setPayment] = useState({
    valor: "",
    paciente: "",
    tipoPagamento: ""

  })

  const[schedule, setSchedule] = useState({
    data: "",
    status: "",
    avaliacao: ""
  })


  //esconder telas
  const [telaLogin, setTelaLogin] = useState(true);

  return ( //html
    <main className="App">

      <button onClick={() => setTelaLogin(!telaLogin)}>
        {telaLogin && ("Cadastrar-se")}
        {!telaLogin && ("Login")}
      </button>

      {/* formulário de cadastro com o campo para email, senha e um botão para enviar */}

      {!telaLogin && (
        <form className="cadastroMedico">

          <p>
            <label htmlFor="nome">Nome do Médico</label><br />
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
            <label htmlFor="numerodocrm">Número do CRM</label><br />
            <input id="numerodocrm" type="number" placeholder="CRM" required />
          </p>

          <p>
            <label htmlFor="ufdocrm">UF do CRM</label><br />
            <input id="ufdocrm" type="text" placeholder="Insira o UF do CRM" required />
          </p>

          <p>
            <label htmlFor="telefone">Telefone</label><br />
            <input id="telefone" type="number" placeholder="Insira o Telefone" required />
          </p>

          <p>
            <label htmlFor="especialidade">Especialidade</label><br />
            <input id="especialidade" type="text" placeholder="Digite a especialidade" required />
          </p>

          <p>
            <label htmlFor="dataEmissao">Data de Emissão</label><br />
            <input id="dataEmissao" type="date" required />
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

        </form>
      )}

       {!telaLogin && (
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
      )}


      {/* formulário de login com o campo para email, senha e um botão para enviar */}

      {telaLogin && (
        <form className='login'>
          <p>Para logar coloque as informações abaixo</p>

          <label>Digite o email
            <input type='email' placeholder='exemplo@exemplo.com' onChange={(e) => setPatient({...patient, email: e.target.value})} />
          </label>

          <br />
          <br />

          <label>Digite a senha
            <input type='password' placeholder='senha' onChange={(e) => setPatient({...patient, senha: e.target.value})} /><br />
          </label>

          <br />

          <button className="btnEntrar">Entrar</button>

        </form>
      )}




    </main>
  );

}

export default App;
