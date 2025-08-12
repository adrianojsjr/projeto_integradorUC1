import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript
  let numero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,]
  let impares = [];

  for (let i = 0;  i<numero.length; i++) { // i começa em 0 e vai até o último índice (numero.length).
    if (numero[i] % 2 !== 0){  //verifica se o resto é diferente de 0
      impares.push(<p>{numero[i]}</p>); //Se for ímpar, adiciona um <p> com o número dentro de impares
    }
  }

  return ( /* aqui é HTML*/
    <main className="App">
      {impares}
    </main>
  );
}

export default App;
