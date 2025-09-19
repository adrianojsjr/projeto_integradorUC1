import './App.css';

import Doctors from './Views/Doctors/Index';
import DoctorsShow from './Views/Doctors/Show';
import DoctorsEdit from './Views/Doctors/Edit';

import Patients from './Views/Patients/Index';


import Payment from './Views/Payment/Index';
import PaymentShow from './Views/Payment/Show';
import PaymentCreate from './Views/Payment/Create';

import Schedule from './Views/Schedule/Index';

import User from './Views/User/Index';

import { supabase } from './Views/User/Index';

import logo from "./logo_teste.png"

import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';

import { useState, useEffect } from 'react';

// Checa a sessão do usuário
function PrivateSession() {
  const hasSession = !!localStorage.getItem('supaSession'); // Verifica se existe uma sessão salva no localStorage
  return hasSession ? <Outlet /> : <Navigate to="/login" replace /> // Se tiver sessão, mostra conteúdo protegido, senão redireciona
}

// Componente principal da aplicação
function App() {
  const hasSession = !!localStorage.getItem('supaSession'); // Checa se existe sessão
  const [uid, setUid] = useState(null); //variavel = uid; função = setUid: essa função atualiza o valor do uid;
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const isPatient = tipoUsuario === "patient";

  useEffect(() => {
    async function pegarUid() {
      const { data: sessionData } = await supabase.auth.getSession(); // pega a sessão do Supabase
      const uid = sessionData?.session?.user?.id; // pega o uid da pessoa logada
      setUid(uid); // salva o UID pela função setUid
    }
    pegarUid()
  }, []);



  return (
    <Router>
      <main className='app'>
        <div className='inicio'>
          <nav>
            {hasSession ? ( // Se usuário estiver logado
              <div className='menu'>
                <span><img src={logo} alt="logo" /></span>
                <div className='btnNav'>
                  {isPatient ? (
                    <>
                      <Link to="/doctors">Inicio</Link>
                      <Link to={`/schedule/${uid}`}>Consultas</Link>
                      <Link to={`/patients/${uid}`}>Meu Perfil</Link>
                    </>
                  ) : (
                    <>
                      <Link to={`/schedule/${uid}`}>Agenda</Link>
                      <Link to={`/doctors/edit/${uid}`}>Meu Perfil</Link>
                    </>
                  )}
                </div>
              </div>
            ) : ( // Se não estiver logado
              <div className='menu'>
                <span> <img src={logo} alt="logo" /> </span>
                <p>Sua consulta na palma da mão</p>
                <div className='btnNav'>
                  <Link to="/doctors">Inicio</Link>
                  <Link to="/user">Login/Cadastro</Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        <Routes> {/* Define as rotas */}
          <Route path='/user' element={<User />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:id' element={<DoctorsShow />} />

          <Route element={<PrivateSession />}>
            <Route path='/doctors/edit/:id' element={<DoctorsEdit />} />
            <Route path='/schedule/:id' element={<Schedule />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/patients/:id' element={<Patients />} />
            <Route path='/payment/create/' element={<PaymentCreate />} />
            <Route path='/payment/:id' element={<PaymentShow />} />

          </Route>

          <Route path='/' element={<Navigate to='/doctors' replace />} />
        </Routes>

        
          <footer >
            <h4>Contato</h4>
            <p>Email: suporte@conectmed.com</p>
            <p>Telefone: (11) 99999-9999</p>
            <p>© {new Date().getFullYear()} ConectMed. Todos os direitos reservados.</p>
          </footer>
        



      </main>
    </Router>
  );
}

export default App;
