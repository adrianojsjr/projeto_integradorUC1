import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript

  let oi = "Olá mundo!!";

  oi += " Adriano";

function soma(a, b){ // parâmetros 
  return a + b;
}

function divide (a, b){
  return a /b;
}


  return ( /* aqui é HTML*/
    <main className="App">
      {soma(oi, " Junior")}<br/>
      {divide(36, 6)}
    </main>




  );
}

export default App;
