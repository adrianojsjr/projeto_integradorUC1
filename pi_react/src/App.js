import logo from './logo.svg';
import './App.css';
import { use, useState } from 'react';
import './cadastroMedico.css';

// function App() {

//   // let oi = "Olá, mundo";

//   // oi += " Mariana";

//   // function soma(a, b) {
//   //   return a + b 
//   // }

//   // function divide (a, b){
//   //   return a/b;
//   // }

//   return (
//     <main className="App">
//       {soma(oi , " Mariana")} <br/>
//       {divide(36, 6)}
//     </main>
//   );
// }


// function App() {

//   function calculadora(a, b, op) {
//     if (op == "+") {
//       return a + b;
//     }
//     else if (op == "-") {
//       return a - b;
//     }
//     else if (op == "/"){
//       return a/b;
//     }
//     else if (op == "*"){
//       return a*b;
//     }

//   }

//   return (
//     <main className="App">
//       {calculadora(10, calculadora(5, 1, "*"), "+")}<br/> 
//       {calculadora(50, 2, "-")}<br/>
//       {calculadora(510, 3, "/")}<br/>
//       {calculadora(784, 6, "*")}
//     </main>
//   );
// }

// function App() {

//   function calculadora(a, b, op) {
//     switch (op) {
//       case "+":
//         return a + b

//       case "-":
//         return a - b

//       case "*":
//         return a * b

//       case "/":
//         return a / b
//     }

//   }

//   return (
//     <main className="App">
//       {calculadora(10, calculadora(5, 1, "*"), "+")}<br />
//       {calculadora(50, 2, "-")}<br />
//       {calculadora(510, 3, "/")}<br />
//       {calculadora(784, 6, "*")}
//     </main>
//   );
// }

// function App() {

//   let cesta = ["pão", "suco", "chocolate", "torrone"];
//   let desenha = [];

// //i=0 -> primeira posição do vetor. No caso, a primeira posição é o pão (casa 0)
// //i<3 -> decide que o vetor vai contar somente até dois, ou seja, vai exibir somente até o chocolate
// //i++ -> soma mais um na posição do vetor
//   for(let i=0; i<3; i++){
//     desenha.push(<p> { cesta[i] } </p>)
//   }

//   return (
//     <main className="App">
//       {desenha}
//     </main>
//   );
// }

// function App() {

//   //faça uma lista com todos os numeros ate 10, mas exiba apenas os numeros impares

//   let numero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//   let impar = [];

//   for (let i = 0; i < numero.length; i++) { // i começa em 0 e vai até o último índice (numero.length).
//     if (numero[i] % 2 !== 0) {  //verifica se o resto é diferente de 0
//       impar.push(<p>{numero[i]}</p>); //Se for ímpar, adiciona um <p> com o número dentro de impares
//     }
//   }




// return (
//   <main className="App">
//     {impar}
//   </main>
// );

// }



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

  const [schedule, setSchedule] = useState({
    data: "",
    status: "",
    avaliacao: ""
  })


  //esconder telas
  const [telaLogin, setTelaLogin] = useState(true);
  const [telaPaciente, setTelaPaciente] = useState(true);

  return ( //html
    <main className="App">


      {!telaLogin  && (
      <button onClick={() => setTelaPaciente(!telaPaciente)}>
        {telaPaciente && ("Cadastro - Paciente")}
        {!telaPaciente && ("Cadastro - Médico")}

      </button>
      )}

      
      

      {!telaLogin && telaPaciente && (

        <form className="cadastroMedico">

          <p>
            <label htmlFor="nome">Nome do Médico</label><br />
            <input id="nome" type="text" placeholder="Nome do titular" />
          </p>

          <p>
            <label htmlFor="email">E-mail</label><br />
            <input id="email" type="email" placeholder="exemplo@email.com" />
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

        </form>
      )}

      {!telaLogin && !telaPaciente && (
        <form className="cadastroPaciente">

          <p>
            <label htmlFor="nome">Nome</label><br />
            <input id="nome" type="text" placeholder="Nome do titular" />
          </p>

          <p>
            <label htmlFor="email">E-mail</label><br />
            <input id="email" type="email" placeholder="exemplo@email.com" />
          </p>

          <p>
            <label htmlFor="cpf">CPF</label><br />
            <input id="cpf" type="number" placeholder="000.000.000-00" />
          </p>


          <p>
            <label htmlFor="telefone">Telefone</label><br />
            <input id="telefone" type="number" placeholder="Insira o Telefone" />
          </p>

          <p>
            <label htmlFor="endereco">Endereço</label><br />
            <input id="endereco" />
          </p>

          <p>
            <label htmlFor="senha">Senha</label><br />
            <input id="senha" />
          </p>

          <p>
            <button onClick={() => setTelaLogin(!telaLogin)}>
              {telaLogin && ("Confirmar Cadastro")}
              {!telaLogin && ("Voltar para cadastro")}

            </button>
          </p>

        </form>
      )}


      {telaLogin && (
        <form className='login'>
          <p>Para logar coloque as informações abaixo</p>

          <label>Digite o email
            <input type='email' placeholder='exemplo@exemplo.com' onChange={(e) => setPatient({ ...patient, email: e.target.value })} />
          </label>

          <br />
          <br />

          <label>Digite a senha
            <input type='password' placeholder='senha' onChange={(e) => setPatient({ ...patient, senha: e.target.value })} /><br />
          </label>

          <br />

          <button className="btnEntrar">Entrar</button>

        </form>
      )}


      <button onClick={() => setTelaLogin(!telaLogin)}>
        {telaLogin && ("Cadastre-se")}
        {!telaLogin && ("Voltar para login")}

      </button>


    </main>
  );

}

export default App;
