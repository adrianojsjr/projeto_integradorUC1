
import './App.css';
import User from './User'
import { BrowserRouter as Router, Routes, Route, Navigate, link, outlet }
  from 'react-router-dom';



function PrivateSession() {
  const hasSession = !!localStorage.getItem('supaSession');
  return hasSession ? <Outlet /> : <Navigate to="/login" replace />
}


function App() {                  //aqui javascript
  const hasSession = !!localStorage.getItem('supaSession');

  return (                         /* Aqui html */
    <Router>
      <main className="App">
        <nav>
          {hasSession ? (
            <>
              <Link to="/Home">Inicial</Link>
              <Link to="/Search">busca</Link>
              <Link to="/MedicalPresentation">apresentação do médico.</Link>
              <Link to="/Schedule">agendamento</Link>
              <Link to="/Payment">pagamento</Link>
            </>

          ) : (
            <>
              <Link to="/Home">Inicial</Link>
              <Link to="/Search">busca</Link>
            </>
          )
          }

        </nav>

        <Routes>
          {/*Rotas Públicas*/}
          <Route path='/Search' element={<Home />} />
          <Route path='/Login' element={<User />} />

          <Route element={<PrivateSession />}>

            {/*Rotas Logado*/}
            <Route path='/Payment' element={<Register />} />
            

            </Route>
                
                <Route path='/' element={<Navigate to= '/Login' replace />} />
        </Routes>

      </main>
    </Router>

  );
}


export default App;