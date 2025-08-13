import logo from './logo.svg';
import './App.css';

// function App() {// Aqui só javaScript
//   let oi = "Olá mundo!!!";

//   oi +=   " Marcius";

// function soma(a, b){//parametros
//   return a + b;

// }


// function divide(a, b){
//   return a / b;
// }

//   return ( //Aqui só HTML
//     <main className="App">
//       {soma(oi, ", Ale")}<br/>
//       {divide(36 , 6)}
//     </main>
//   );
// }

// function App(){
// function calculadora(a,b,op){
// if(op=="+"){
//   return a + b
// }
// else if(op =="-"){
//   return a - b;
// }
// else if(op =="/"){
//   return a / b;
// }
// else if(op =="*"){
//   return a * b;
// }
//   switch(op){
//     case "+":
//       return a + b
//     case "-":
//       return a - b
//     case "*":
//       return a * b
//     case "/":
//       return a / b      


//   }
// }

// return (
//   <main className='App'>
//     {calculadora(9, calculadora(8, 7, "*"),"+")}<br/>
//     {calculadora(10, 2,"-")}<br/>
//     {calculadora(1, 2,"/")}<br/>
//     {calculadora(1, 2,"*")}<br/>

//   </main>
// );
// }

// function App() {

//   let cesta = ["Pão", "Suco", "Chocolate", "Torrone."]
//   let desenha = [];

//  // declara o indice; compara se é para continuar; incremento o indice
//  for(let i=0; i<3 ; i++){
//   desenha.push(<p> {cesta[i]} </p>)



//   }

//   return (
//     <main className="App">
//       {
//        desenha
//       }




//     </main>
//   );
// }


// export default App;
// function App(){
// let numero = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//   let impar = []

//   for(let i=0; i<11; i=i+2){
//     impar.push(<p> { numero[i] } </p>)
// }



//   return (
//     <main className="App">
//       {impar}
//     </main>
//   );
// }



// export default App;

// function App() {

//   //faça uma lista com todos os numeros ate 10, mas exiba apenas os numeros impares

//     let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//     let impars = [];

//     for (let i = 0; i < numbers.length; i++) {
//       if (numbers[i] % 2 != 0) {
//         impars.push(<p> {numbers[i]} </p>);
//       }

//     }


//   return (
//     <main className="App">
//       {impars}
//     </main>
//   );

// }

function App() {                  //aqui javascript

  let email = ""

  let senha = ""

  function mudaEmail(valor){
    email = valor
  }


  function mudaSenha(valor){
    senha = valor
  }

  function enviar(){
    alert(" Email: " +email+" senha "+senha)
  }

  let telaLogin = true;



  return (                         /* Aqui html */
    <main className="App">

      <button onClick={() => {telaLogin = !telaLogin}}>
        {telaLogin && ("Cadastrar-se")}
        {!telaLogin && ("Cadastrar-se")}
      </button>

      {!telaLogin && (
        <form className='cadastro'> 
     

        </form>
       )}


      { telaLogin && (
        <form className='login'> 

          <label >Digite Seus Dados</label>

          <br></br>

          <label>
            Email: <input  type='email' placeholder='Email' onChange={(e) => mudaEmail(e.target.value)}></input>
          </label>

          <br></br>
          <br></br>

          <label>
            Senha: <input type='password' placeholder=' Senha ' onChange={(e) => mudaSenha(e.target.value)} ></input>
          </label>

          <p><button className='buttonSucess' type='' onClick={() => enviar()}> Entrar </button></p>
        </form>
      )}



    </main>
  );
}


export default App;

