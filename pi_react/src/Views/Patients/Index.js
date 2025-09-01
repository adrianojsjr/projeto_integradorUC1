import {useState} from 'react';



 
function Patients() {                  //aqui javascript
  const [user, setUser] = useState({
    email: "",
    senha:"",
    telefone:"",
    nome:"",
    cpf: ""

  });
 
  
 
 
 
  function enviar(){
    alert("email:"+user.email+" senha:"+user.password)
  }
 
 
 
  //const [email, setEmail] = useState("")//
  //const [senha, setSenha] = useState("")//

  const [isLogin, setIsLogin] = useState(true)
  
 
  return (                         /* Aqui html */
    <main className="App">
 
      <button onClick={() => setIsLogin (!isLogin)} >
        {isLogin &&("Cadastrar-se")}
        {!isLogin &&("Voltar para o login")}
      </button>
     
      {!isLogin &&(
     <form className="register"></form>
      )}
 
      {isLogin &&(
      <form className="login">
 
        <label >Digite Seus Dados</label>
 
        <br></br>
        <label>
          Email: <input  type='email' placeholder='Email' onChange={(e) => setUser({...user, email: e.target.value}) } ></input>
        </label>
 
        <br></br>
        <br></br>
        <label>
          Senha: <input type='password' placeholder=' Senha ' onChange={(e) => setUser ({... user, password: e.target.value})}></input>
        </label>
 
        <p><button style={{background:"white", color: "black"}} type='submit' onClick={() => enviar()} >Entrar</button></p>
      </form>
      )}
 
     
 
 
     
 
 
 
 
    </main>
  );
}
 
 
export default Patients;