import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

import './Style.css';

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"
const supabase = createClient(supabaseUrl, supabaseKey);



function Doctor() {

  const nav = useNavigate();
  const {id} = useParams();

    const [doctor, setDoctor] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    numeroCRM: "",
    ufCRM: "",
    dataEmissaoCRM: "",
    especialidade: "",
    residencia: [],
    ativo: "",
    imagem: "",
    diploma: "",
    situacaoRegular: "",
    disponibilidade: []
  });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");


    useEffect(() => {
      listarMedicos()
    }, [])
  
    
    async function register() {
        setLoading(true);
    
        try {
          let { data, error } = await supabase.auth.signUp({
            email: doctor.email,
            password: doctor.password
          })
    
          if (error) throw error
    
          if (data.status == 400) throw data.message
    
          setMsg("Cadastro realizado!");
        } catch (e) {
          setMsg(`Error: ${e.message}`);
        }
    
        setLoading(false);
    
        setTimeout(() => setMsg(""), 5000);
      }
    
  
  
    async function listarMedicos() {
  
      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single(); /*retorna um só*/ 
        setDoctor(dataDoctors);
  
    }


  return (
    <main>

      <div class="card">
        {/* formulário de cadastro com o campo para email, senha e um botão para enviar */}
          <form onSubmit={(e) => e.preventDefault()}>

            <p>
              <label>Nome</label>
              <input id="nome" type="text" value={doctor.nome} placeholder="Nome do titular" onChange={(e) => setDoctor({ ...doctor, nome: e.target.value })} />
            </p>

             <p>
              <label>E-mail</label>
              <input id="email" type="email" value={doctor.email} placeholder="exemplo@email.com" onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF</label>
              <input id="cpf" type="text" value={doctor.cpf} placeholder="000.000.000-00" onChange={(e) => setDoctor({ ...doctor, cpf: e.target.value })} />
            </p>

            <p>
              <label>Número do CRM</label>
              <input id="numerodocrm" type="text" value={doctor.numeroCRM} placeholder="CRM" onChange={(e) => setDoctor({ ...doctor, numeroCRM: e.target.value })} />
            </p>

            <p>
              <label>UF do CRM</label>
              <input id="ufdocrm" type="text" value={doctor.ufCRM} placeholder="Insira o UF do CRM" onChange={(e) => setDoctor({ ...doctor, ufCRM: e.target.value })} />
            </p>

            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" value={doctor.telefone} placeholder="Insira o Telefone" onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} />
            </p>

            <p>
              <label>Especialidade</label>
              <input id="especialidade" type="text" value={doctor.especialidade} placeholder="Digite a especialidade" onChange={(e) => setDoctor({ ...doctor, especialidade: e.target.value })} />
            </p>

            <p>
              <label>Data de Emissão</label>
              <input id="dataEmissao" type="date" value={doctor.dataEmissaoCRM} onChange={(e) => setDoctor({ ...doctor, dataEmissaoCRM: e.target.value })} />
            </p>

            <div>
              <p>
                <label className="btnUpload">Anexar residência médica</label>
                <input id="residencia" value={doctor.residencia} type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, residencia: e.target.value })} />
              </p>

              <p>
                <label className="btnUpload">Anexar diploma acadêmico</label>
                <input id="diploma" type="file" value={doctor.diploma} name="arquivo" onChange={(e) => setDoctor({ ...doctor, diploma: e.target.value })} />
              </p>

              <p>
                <label className="btnUpload">Comprovante de situação regular</label>
                <input id="comprovante" value={doctor.situacaoRegular} type="file" name="arquivo" onChange={(e) => setDoctor({ ...doctor, situacaoRegular: e.target.value })} />
              </p>
            </div>

            <p>
              <label>Senha</label>
              <input id="password" type="password" value={doctor.senha} onChange={(e) => setDoctor({ ...doctor, senha: e.target.value })} required />
            </p>

            <button className="buttonSucess" type="button" onClick={register} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
      </div>

  
    </main>
  );
}

export default Doctor;
