
import './App.css';
import Doctors from './Doctors'
import Patients from './Patients'
import Payment from './Payment'
import Schedule from './Schedule'
import User from './User'
import "./logo_teste.png"



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
                <img src="./logo_teste.png" alt="" />
                <Link to="/doctors">Inicio</Link>
                <Link to="/schedule">Agendamento</Link>
                <Link to="/payment">Pagamento</Link>
                <Link to="/patients">Pacientes</Link>
              </div>

            ) : (
              <div className='menu'>

                <img src="./logo_teste.png" alt="" />
                <p>Sua consulta na palma da mão</p>
                <Link to="/doctors">Inicio</Link>
                <Link to="/user">Login/Cadastro</Link>

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