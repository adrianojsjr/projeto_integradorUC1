import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript

  function calculadora(a, b, op) {
    if (op == '+') {
      return a + b;
    }

    else if (op == '-') {
      return a - b;
    }

    else if(op == '/'){
      return a /b;
    }

    else if (op == '*') {
      return a *b;
    }
  }

  return ( /* aqui é HTML*/
    <main className="App">
      {calculadora(1, calculadora(2, 1, '*'),'+')}<br />
      {calculadora(5,1, '-')}<br />
      {calculadora(10,2, '/')}<br />
      {calculadora(5,2, '*')}<br />
    </main>




  );
}

export default App;
