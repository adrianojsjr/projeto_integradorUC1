import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript

  function calculadora(a, b, op) {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return a / b
    }
  }

  return ( /* aqui é HTML*/
    <main className="App">
      {calculadora(1, calculadora(2, 1, '*'), '+')}<br />
      {calculadora(5, 1, '-')}<br />
      {calculadora(10, 2, '*')}<br />
      {calculadora(5, 2, '/')}<br />
    </main>




  );
}

export default App;
