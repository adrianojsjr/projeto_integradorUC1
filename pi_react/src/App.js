
import './App.css';
import Doctors from './Views/Doctor/Doctors'
import Patients from './Views/Patients/Patients'
import Payment from './Views/Payment/Payments'
import Schedule from './Views/Schedule/Schedule'
import User from './User'
import logo from "./logo_teste.png"



import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet }
  from 'react-router-dom';



function PrivateSession() {
  const hasSession = !!localStorage.getItem('supaSession');
  return hasSession ? <Outlet /> : <Navigate to="/login" replace />
}


function App() {                  //aqui javascript
  const hasSession = !!localStorage.getItem('supaSession');

  return (                         /* Aqui html */
    <Router>
      <main>

        <div className='inicio'>

          <nav>
            {hasSession ? (
              <div className='menu'>
                <img src={logo} />
                
                <div className='btnNav'>
                  <Link to="/doctors">Inicio</Link>
                <Link to="/schedule">Agendamento</Link>
                <Link to="/payment">Pagamento</Link>
                <Link to="/patients">Pacientes</Link>
                
                </div>
              </div>

            ) : (
              <div className='menu'>

                <img src={logo} to="/doctors"/>
                <p>Sua consulta na palma da mão</p>
                <div className='btnNav'>
                <Link to="/doctors">Inicio</Link>
                <Link to="/user">Login/Cadastro</Link>
                </div>

              </div>
            )
            }

          </nav>


        </div>

        <Routes>
          {/*Rotas Públicas*/}

          <Route path='/user' element={<User />} />
          <Route path='/doctors' element={<Doctors />} />

          <Route element={<PrivateSession />}>

            {/*Rotas Logado*/}

            <Route path='/schedule' element={<Schedule />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/patients' element={<Patients />} />


          </Route>

          <Route path='/' element={<Navigate to='/user' replace />} />
        </Routes>

      </main>
    </Router>

  );
}


export default App;