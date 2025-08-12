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

function App() {

  let cesta = ["pão", "suco", "chocolate", "torrone"];
  let desenha = [];

//i=0 -> primeira posição do vetor. No caso, a primeira posição é o pão (casa 0)
//i<3 -> decide que o vetor vai contar somente até dois, ou seja, vai exibir somente até o chocolate
//i++ -> soma mais um na posição do vetor
  for(let i=0; i<3; i++){
    desenha.push(<p> { cesta[i] } </p>)
  }

  return (
    <main className="App">
      {desenha}
    </main>
  );
}



export default App;
