
import './App.css';
import Doctors from './doctors'
import Patients from './patients'
import Payment from './payment'
import Schedule from './schedule'


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
              <Link to="/doctors">Inicial</Link>
              <Link to="/schedule">agendamento</Link>
              <Link to="/payment">pagamento</Link>
              <Link to="/patients">pacientes</Link>
            </>

          ) : (
            <>
              <Link to="/doctors">Inicial</Link>
              <Link to="/user">Login</Link>

            </>
          )
          }

        </nav>

        <Routes>
          {/*Rotas Públicas*/}
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/user' element={<User />} />


          <Route element={<PrivateSession />}>

            {/*Rotas Logado*/}
            
            <Route path='/schedule' element={<Schedule/>} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/patients' element={<Patients />} />


          </Route>

          <Route path='/' element={<Navigate to='/doctors' replace />} />
        </Routes>

      </main>
    </Router>

  );
}


export default App;