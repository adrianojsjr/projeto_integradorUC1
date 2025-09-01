// Importa o arquivo de estilos CSS principal
import './App.css';

// Importa as páginas de Doctors
import Doctors from './Views/Doctors/Index';
import DoctorsShow from './Views/Doctors/Show';
import DoctorsEdit from './Views/Doctors/Edit';

// Importa as páginas de Patients
import Patients from './Views/Patients/Index';
import PatientShow from './Views/Patients/Show';

// Importa as páginas de Payment
import Payment from './Views/Payment/Index';
import PaymentShow from './Views/Payment/Show';

// Importa a página de Schedule
import Schedule from './Views/Schedule/Index';

// Importa a página de login/cadastro
import User from './User'

import { supabase } from './User';

// Importa o logo
import logo from "./logo_teste.png"

// Importa componentes do React Router
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';

import { useState, useEffect } from 'react'; // Importa hooks do React para estado e efeitos

// Componente para checar sessão do usuário
function PrivateSession() {
  // Verifica se existe uma sessão salva no localStorage
  const hasSession = !!localStorage.getItem('supaSession');
  // Se tiver sessão, renderiza o conteúdo protegido (Outlet), senão redireciona para login
  return hasSession ? <Outlet /> : <Navigate to="/login" replace />
}

// Componente principal da aplicação
function App() {                  
  // Checa se existe sessão
  const hasSession = !!localStorage.getItem('supaSession');
  const [uid, setUid] = useState(null); // armazena o uid do usuário logado

  useEffect(() => {
    async function getUid() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      setUid(userId);
    }
    getUid();
  }, []);

  // Aqui começa o HTML da aplicação
  return (                         
    <Router>
      <main>

        {/* Cabeçalho da aplicação */}
        <div className='inicio'>
          <nav>
            {hasSession ? (
              // Se o usuário estiver logado
              <div className='menu'>
                {/* Logo no topo */}
                <img src={logo} />
                <div className='btnNav'>
                  {/* Links principais */}
                  <Link to="/doctors">Inicio</Link>
                  <Link to="/schedule">Consultas</Link>
                  {/* Link para o perfil (lembrando que uid precisa estar definido em outro lugar) */}
                  <Link to={`/doctors/${uid}`}>Meu Perfil</Link>
                </div>
              </div>
            ) : (
              // Se o usuário não estiver logado
              <div className='menu'>
                {/* Logo */}
                <img src={logo} to="/doctors"/>
                {/* Mensagem de boas-vindas */}
                <p>Sua consulta na palma da mão</p>
                <div className='btnNav'>
                  {/* Links para usuários não logados */}
                  <Link to="/doctors">Inicio</Link>
                  <Link to="/user">Login/Cadastro</Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Rotas da aplicação */}
        <Routes>
          {/* Rotas públicas */}
          <Route path='/user' element={<User />} />
          <Route path='/doctors' element={<Doctors/>} />

          {/* Rotas protegidas, somente usuários logados */}
          <Route element={<PrivateSession />}>
            <Route path='/doctors/edit/:id' element={<DoctorsEdit />} />
            <Route path='/doctors/:id' element={<DoctorsShow />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/patients' element={<Patients />} />
            <Route path='/payment:id' element={<PaymentShow />} />
          </Route>

          {/* Rota padrão, redireciona para login */}
          <Route path='/' element={<Navigate to='/user' replace />} />
        </Routes>

      </main>
    </Router>
  );
}

// Exporta o componente principal
export default App;
