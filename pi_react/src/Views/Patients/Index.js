import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { supabase } from '../User/Index';

function Patient() {

  // estado para os dados do paciente no cadastro
  const [patient, setPatient] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    ativo: ""
  });

  const nav = useNavigate();
  const { id } = useParams(); // Pega o ID do paciente
  const [schedule, setSchedule] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    listarPacientes(id);
    readSchedule();
  }, [id])



  async function listarPacientes(id) {
    let { data: dataPatient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('supra_id', id)
      .single()
    setPatient(dataPatient); 
  }

  if (!patient) return <p>Carregando...</p>;

  async function readSchedule(patient_id) {

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*') // Seleciona todos os campos

    setSchedule(dataSchedule || []); // Atualiza estado

  }

  function formatarData(data) {
    const date = new Date(data)

    const dataFormatada =

      date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const horaFormatada =

      date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    return `${dataFormatada} ${horaFormatada}`;

    //poderia ser também return dataFormatada + ' ' + horaFormatada;
  }

  const validarSessao = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;

    if (!uid) {
      // Salva a rota atual para voltar depois do login
      const redirect = encodeURIComponent(window.location.pathname);
      nav(`/user?redirect=${redirect}`, { replace: true });
      return;
    }

    nav(`/payment/`, { replace: true });
  };

  // Função para deslogar
  async function logout() {
    await supabase.auth.signOut();

    // Limpa qualquer dado local (se usado)
    localStorage.clear();
    sessionStorage.clear();
    
    nav("/user", { replace: true });
    window.location.reload(); // Recarrega a página
  }


  return (
    <main>

      <div class="card">


      <form onSubmit={(e) => e.preventDefault()}>

        <p>
          <label>Nome</label>
          <input id="nome" type="text" placeholder="Nome do titular" value={patient.nome} onChange={(e) => setPatient({ ...patient, nome: e.target.value })} required />
        </p>

        <p>
          <label>E-mail</label>
          <input id="email" type="email" placeholder="exemplo@email.com" value={patient.email} onChange={(e) => setPatient({ ...patient, email: e.target.value })} required />
        </p>

        <p>
          <label>CPF</label>
          <input id="cpf" type="text" placeholder="000.000.000-00" value={patient.cpf} onChange={(e) => setPatient({ ...patient, cpf: e.target.value })} required />
        </p>


        <p>
          <label>Telefone</label>
          <input id="telefone" type="text" placeholder="Insira o Telefone" value={patient.telefone} onChange={(e) => setPatient({ ...patient, telefone: e.target.value })} required />
        </p>

        <button className="buttonSucess" type="button" onClick={listarPacientes} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>

         <button className="buttonLogout" type="button" onClick={logout}>
            Sair
          </button>

      </form>

      </div>



    </main>
  );
}

export default Patient; 
