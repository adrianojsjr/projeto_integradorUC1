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

function App() {

  let cesta = ["Pão", "Suco", "Chocolate", "Torrone."]
  let desenha = [];
  
 // declara o indice; compara se é para continuar; incremento o indice
 for(let i=0; i<3 ; i++){
  desenha.push(<p> {cesta[i]} </p>)


            
  }
 
  return (
    <main className="App">
      {
       desenha
      }
      

        
     
    </main>
  );
}


export default App;
