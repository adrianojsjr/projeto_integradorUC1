import logo from './logo.svg';
import './App.css';

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



function App() {

  //variável para o email
  let email

  function mudaEmail(valor) {

    email = valor

  }


  //variável para senha
  let senha

  function mudaSenha(valor) {

    senha = valor

  }

  function enviar() {
    alert("Email: " + email + " senha: " + senha)
  }

  let telaLogin = true;

  function mudaTela(){
    telaLogin = !telaLogin
  }

  return (
    <main className="App">

      <button onClick={() => mudaTela()}>
        {telaLogin && ("Cadastrar-se")}
        {!telaLogin && ("Login")}
      </button>

      {/* formulário de cadastro com o campo para email, senha e um botão para enviar */}

      { !telaLogin && (
        <form className='cadastro'>
        </form>
      )}


      {/* formulário de login com o campo para email, senha e um botão para enviar */}

      {telaLogin && (
        <form className='login'>
          <p>Para logar coloque as informações abaixo</p>

          <label>Digite o email
            <input type='email' placeholder='exemplo@exemplo.com' onChange={(e) => mudaEmail(e.target.value)} />
          </label>

          <br />
          <br />

          <label>Digite a senha
            <input type='password' placeholder='senha' onChange={(e) => mudaSenha(e.target.value)} /><br />
          </label>

          <br />

          <button className="btnEntrar" onClick={() => enviar()}>Entrar</button>

        </form>
      )}




    </main>
  );

}

export default App;
