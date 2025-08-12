import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript
  let numero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,]
  let impares = [];

  for (let i = 0;  i<numero.length; i++) {
    if (numero[i] % 2 !== 0){ 
      impares.push(<p>{numero[i]}</p>);
    }
  }




  return ( /* aqui é HTML*/
    <main className="App">
      {impares}



    </main>




  );
}

export default App;
