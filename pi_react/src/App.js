import logo from './logo.svg';
import './App.css';

function App() { // Aqui é JavaScript

  let cesta = ['pão', 'suco', 'chocolate', 'torrone']

  let desenha = [];
  //declara o índice; compara se é para continuar; incrementa o índice
  for( let i=0; i<3 ; i++){
    
    desenha.push(<p> {cesta[i] } </p>)
  }
 

  return ( /* aqui é HTML*/
    <main className="App">
    
    {desenha}  
      
       
     
    </main>




  );
}

export default App;
