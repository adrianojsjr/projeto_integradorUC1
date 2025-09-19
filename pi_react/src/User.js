
import { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate, useLocation } from 'react-router-dom';

import './App.css';
import './user.css';

// informações para conexão com Supabase
const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

export const supabase = createClient(supabaseUrl, supabaseKey); // cria cliente Supabase


function User() { // componente principal User

  const nav = useNavigate(); //navegar entre telas
  const location = useLocation();

  // estado para os dados do médico no cadastro
  const [doctor, setDoctor] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    numeroCRM: "",
    ufCRM: "",
    dataEmissaoCRM: "",
    especialidade_id: "",
    residencia: [],
    ativo: "",
    fotoPerfil: [],
    diploma: [],
    situacaoRegular: [],
    resumoProfissional: ""
  });

  const [msg, setMsg] = useState(""); // estado para mensagens de feedback (erro, sucesso)

  // estado para os dados do paciente no cadastro
  const [patient, setPatient] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    ativo: ""
  });

  const [especialidade, setEspecialidades] = useState([]);


  useEffect(() => {
    listarEspecialidades();
  }, []);

  const [loading, setLoading] = useState(false); // estado para indicar carregamento

  async function listarEspecialidades() {
    let { data: dataEspecialidade, error } = await supabase
      .from('especialidade')
      .select('*')
    setEspecialidades(dataEspecialidade); // Atualiza estado com resultado filtrado

  }

  function validarCRM(crm) {
    // Só letras maiúsculas, números e traço
    const regex = /^[A-Z0-9\-]+$/i;
    if (!crm) return false; // obrigatório
    if (crm.length < 4 || crm.length > 10) return false; // tamanho

    if (!regex.test(crm)) return false; // caracteres inválidos

    return true;
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Elimina CPFs com todos dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }



  // função de cadastro de médico
  async function register() {
    // validação antes de chamar o Supabase
    const camposFaltando = [];

    if (!doctor.nome || doctor.nome.trim() === "") camposFaltando.push("Nome");
    else if (/\d/.test(doctor.nome)) camposFaltando.push("Nome (não pode conter números)");

    if (!doctor.email) camposFaltando.push("Email");
    if (!doctor.senha) camposFaltando.push("Senha");
    if (!doctor.cpf) camposFaltando.push("CPF");
    if (!doctor.telefone) camposFaltando.push("Telefone");
    if (!doctor.numeroCRM) camposFaltando.push("Número do CRM");
    if (!doctor.ufCRM) camposFaltando.push("UF do CRM");
    if (!doctor.dataEmissaoCRM) camposFaltando.push("Data de Emissão do CRM");
    if (!doctor.especialidade_id) camposFaltando.push("Especialidade");
    if (!doctor.resumoProfissional) camposFaltando.push("Resumo Profissional");

    if (doctor.residencia.length === 0) camposFaltando.push("Comprovante de Residência");
    if (doctor.diploma.length === 0) camposFaltando.push("Diploma Acadêmico");
    if (doctor.situacaoRegular.length === 0) camposFaltando.push("Comprovante de Situação Regular");
    if (doctor.fotoPerfil.length === 0) camposFaltando.push("Foto de Perfil");

    if (camposFaltando.length > 0) {
      setMsg(`⚠️ Preencha os seguintes campos obrigatórios:\n- ${camposFaltando.join("\n- ")}`);
      setTimeout(() => setMsg(""), 7000);
      return;
    }



    if (!emailValido(doctor.email)) {
      setMsg("❌ E-mail inválido. Verifique o endereço digitado.");
      setTimeout(() => setMsg(""), 4000);
      return;
    }

    if (!validarCPF(doctor.cpf)) {
      setMsg("⚠️ CPF inválido!");
      setTimeout(() => setMsg(""), 5000);
      return;
    }

    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: doctor.email,
        password: doctor.senha
      });
      if (error) {
        console.log("Erro no cadastro do médico:", error.message);
        if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("duplicate")) {
          setMsg("❌ Este e-mail já está cadastrado!");
          setTimeout(() => setMsg(""), 5000);
          setLoading(false);
          return;
        } else {
          throw error;
        }
      }

      const uid = data?.user?.id;

      // Verifica se já existe registro na tabela doctors com esse supra_id
      let { data: existingDoctor, error: errCheck } = await supabase
        .from("doctors")
        .select("supra_id")
        .eq("supra_id", uid)
        .single();

      if (existingDoctor) {
        setMsg("❌ Este e-mail já está cadastrado!");
        setLoading(false);
        return;
      }

      delete doctor.senha;

      let { error: eD } = await supabase
        .from("doctors")
        .insert([{
          ...doctor,
          supra_id: uid,
          ativo: true
        }]);

      if (eD) throw eD;

      setMsg("✅ Cadastro realizado! Verifique seu e-mail para confirmar.");
      setTelaLogin(true);

    } catch (e) {
      setMsg(`❌ Error: ${e.message}`);
      console.log(e.message);
    }

    setLoading(false);
    setTimeout(() => setMsg(""), 5000);
  }
  // função de cadastro de paciente
  async function registerPatient() {
    if (
      !patient.nome ||
      !patient.email ||
      !patient.senha ||
      !patient.cpf ||
      !patient.telefone
    ) {
      setMsg("⚠️ Há campos obrigatórios que precisam ser preenchidos!");
      setTimeout(() => setMsg(""), 5000);
      return;
    }

    if (!emailValido(patient.email)) {
      setMsg("❌ E-mail inválido. Verifique o endereço digitado.");
      setTimeout(() => setMsg(""), 5000);
      return;
    }

    if (!validarCPF(patient.cpf)) {
      setMsg("⚠️ CPF inválido!");
      setTimeout(() => setMsg(""), 5000);
      return;
    }

    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: patient.email,
        password: patient.senha
      });
      if (error) throw error;
      if (data.status === 400) throw new Error(data.message);

      const uid = data?.user?.id;

      let { error: eD } = await supabase
        .from("patients")
        .insert([
          {
            supra_id: uid,
            email: patient.email,
            telefone: patient.telefone,
            nome: patient.nome,
            cpf: patient.cpf,
            ativo: true,

          }
        ]);

      if (eD) throw eD;

      setMsg("✅ Cadastro realizado! Verifique seu e-mail para confirmar.");
      setTelaLogin(true);
    } catch (e) {
      if (e.message.includes("User already registered") || e.status === 400) {
        setMsg("❌ Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
      } else {
        setMsg(`❌ Error: ${e.message}`);
      }
    }

    setLoading(false);
    setTimeout(() => setMsg(""), 5000);
  }

  function emailValido(email) {
    // Regex simples e funcional
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function logar() {
    setLoading(true);
    try {
      // Verifica se o email existe em doctors
      let { data: doctorExists } = await supabase
        .from('doctors')
        .select('supra_id')
        .eq('email', doctor.email)
        .single();

      // Verifica se o email existe em patients
      let { data: patientExists } = await supabase
        .from('patients')
        .select('supra_id')
        .eq('email', doctor.email)
        .single();

      // Se não existir em nenhum, redireciona para cadastro
      if (!doctorExists && !patientExists) {
        setMsg("❌ Email não cadastrado");
        setLoading(false);
        setTimeout(() => setMsg(""), 4000);
        nav('/user');
        return;
      }

      // Login com Supabase Auth
      let { data, error } = await supabase.auth.signInWithPassword({
        email: doctor.email,
        password: doctor.senha
      });

      if (error) {
        // erro de login (senha errada, conta não confirmada etc.)
        if (error.message === "Invalid login credentials") {
          setMsg("❌ Email ou senha incorretos.");
        } else {
          setMsg("❌ Erro ao tentar logar: " + error.message);
        }
        setLoading(false);
        setTimeout(() => setMsg(""), 4000);
        return;
      }

      const uid = data.user.id;
      const tipoUsuario = doctorExists ? 'doctor' : 'patient';

      localStorage.setItem('tipoUsuario', tipoUsuario);
      localStorage.setItem('supaSession', data.session);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");

      setMsg("✅ Login realizado com sucesso!");
      setTimeout(() => setMsg(""), 4000);


      if (redirect) {
        nav(redirect, { replace: true });
      } else {
        nav(tipoUsuario === 'doctor' ? `/schedule/${uid}` : "/", { replace: true });
      }
      
      window.location.reload();
    } catch (err) {
      setMsg("❌ Ocorreu um erro inesperado: " + err.message);
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setLoading(false);
    }
  }


  const enviarArquivo = async (e, campo, pasta) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setMsg("");

      const filePath = `${pasta}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("arquivos_medicos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("arquivos_medicos")
        .getPublicUrl(filePath);

      setDoctor(prev => {
        const prevFiles = Array.isArray(prev[campo]) ? prev[campo] : [];
        return {
          ...prev,
          [campo]: [{ name: file.name, url: publicData.publicUrl }]
        };
      });

      setMsg("Upload realizado com sucesso!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Erro ao fazer upload:", err.message);
      setMsg(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // esconde telas
  const [telaLogin, setTelaLogin] = useState(true);
  const [souMedico, setSouMedico] = useState(false);


  return (
    <main className="App">
      
      <div className="card">
        <div className='alert'>
          {msg && (
            <div className={`alert ${msg.startsWith("✅") ? "success" : "error"}`}>
              {msg}
            </div>
          )}
        </div>


        {!telaLogin && souMedico && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="beneficiosMedico">
              <h2>Seja bem-vindo à nossa plataforma!</h2>
              <p>Ao se cadastrar como médico, você terá acesso a uma série de vantagens:</p>
              <ul>
                <li>Divulgue sua agenda de forma simples e prática: basta cadastrar seus horários disponíveis.</li>
                <li>Receba pacientes diretamente pela plataforma, com agendamentos automáticos na sua agenda.</li>
                <li>Cada consulta tem duração padrão de 30 minutos, garantindo organização e produtividade.</li>
                <li>O valor da consulta é de R$ 120,00, com recebimento líquido 75% deste valor.</li>
              </ul>
              <p>Cadastre-se agora e comece a atender online de forma rápida, prática e sem burocracia.</p>
            </div>
            <h3>Cadastro Médico</h3>

            <p className='fotoPerfil'>  <img
              src={doctor.fotoPerfil?.[0]?.url}

            />
            </p>

            <div className='upload'>
              <p>
                <input type="file" id="uploadFoto" onChange={(e) => enviarArquivo(e, "fotoPerfil", "fotoPerfil")} />
                <label htmlFor="uploadFoto" className="btnUpload">Enviar Foto de Perfil*</label>
              </p>

              <div className="uploadedFiles">
                {doctor.fotoPerfil?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    <button className='btnDelete' type="button" onClick={() => {
                      setDoctor(prev => ({
                        ...prev,
                        fotoPerfil: prev.fotoPerfil.filter((_, i) => i !== index)
                      }));
                    }}>❌ Remover</button>
                  </div>
                ))}
              </div>

            </div>



            <p>
              <label>Nome*</label>
              <input id="nome" type="text" placeholder="Nome do titular" onChange={(e) => setDoctor({ ...doctor, nome: e.target.value })} required />
            </p>

            <p>
              <label>E-mail*</label>
              <input id="email" type="email" placeholder="exemplo@email.com" onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF*</label>
              <input id="cpf" type="text" placeholder="000.000.000-00" onChange={(e) => setDoctor({ ...doctor, cpf: e.target.value })} required />
            </p>

            <p>
              <label>Número do CRM*</label>
              <input id="numerodocrm" type="text" placeholder="CRM" onChange={(e) => setDoctor({ ...doctor, numeroCRM: e.target.value })} required />
            </p>

            <p>
              <label>UF do CRM*</label>
              <select
                value={doctor.ufCRM}
                onChange={(e) => setDoctor({ ...doctor, ufCRM: e.target.value })}
                required
              >
                <option value="">Selecione um estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </p>
            <p>
              <label>Data de Emissão*</label>
              <input id="dataEmissao" type="date" onChange={(e) => setDoctor({ ...doctor, dataEmissaoCRM: e.target.value })} required />
            </p>

            <p>
              <label>Telefone*</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone" onChange={(e) => setDoctor({ ...doctor, telefone: e.target.value })} required />
            </p>

            <p>
              <label>Especialidade*</label>
              <select value={doctor.especialidade_id} onChange={(e) => setDoctor({ ...doctor, especialidade_id: e.target.value })} required>
                <option value="">Selecione uma especialidade</option>
                {especialidade.map(
                  e => (
                    <option key={e.id} value={e.id}>{e.nome}</option>
                  )
                )
                }
              </select>
            </p>

            <p>
              <label>Resumo Profissional*</label>
              <textarea rows="7" id="resumoProfissional" type='text' onChange={(e) => setDoctor({ ...doctor, resumoProfissional: e.target.value })} required />
            </p>
            <div className='upload'>

              {/* Comprovante de residência */}
              <p>
                <input type="file" id="uploadResidencia" onChange={(e) => enviarArquivo(e, "residencia", "residencias")} />
                <label htmlFor="uploadResidencia" className="btnUpload">Enviar comprovante de residência*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.residencia?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    <button className='btnDelete' type="button" onClick={() => {
                      setDoctor(prev => ({
                        ...prev,
                        residencia: prev.residencia.filter((_, i) => i !== index)
                      }));
                    }}>❌ Remover</button>
                  </div>
                ))}
              </div>

              {/* Diploma acadêmico */}
              <p>
                <input type="file" id="uploadDiploma" onChange={(e) => enviarArquivo(e, "diploma", "diplomas")} />
                <label htmlFor="uploadDiploma" className="btnUpload">Anexar diploma acadêmico*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.diploma?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    <button className='btnDelete' type="button" onClick={() => {
                      setDoctor(prev => ({
                        ...prev,
                        diploma: prev.diploma.filter((_, i) => i !== index)
                      }));
                    }}>❌ Remover</button>
                  </div>
                ))}
              </div>

              {/* Comprovante de situação regular */}
              <p>
                <input type="file" id="uploadComprovante" onChange={(e) => enviarArquivo(e, "situacaoRegular", "situacaoRegular")} />
                <label htmlFor="uploadComprovante" className="btnUpload">Comprovante de situação regular*</label>
              </p>
              <div className="uploadedFiles">
                {doctor.situacaoRegular?.map((file, index) => (
                  <div key={index} className="fileItem">
                    <span href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</span>
                    <button className='btnDelete' type="button" onClick={() => {
                      setDoctor(prev => ({
                        ...prev,
                        situacaoRegular: prev.situacaoRegular.filter((_, i) => i !== index)
                      }));
                    }}>❌ Remover</button>
                  </div>
                ))}
              </div>



            </div>

            <p>
              <label>Senha*</label>
              <input id="password" type="password" onChange={(e) => setDoctor({ ...doctor, senha: e.target.value })} required />
            </p>

            <button className="buttonSucess" type="button" onClick={register} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        )}


        {!telaLogin && !souMedico && (
          <form onSubmit={(e) => e.preventDefault()} title='Cadastro Paciente'>
            <h3>Cadastro Paciente</h3>
            <p>
              <label>Nome</label>
              <input id="nome" type="text" placeholder="Nome do titular" onChange={(e) => setPatient({ ...patient, nome: e.target.value })} required />
            </p>

            <p>
              <label>E-mail</label>
              <input id="email" type="email" placeholder="exemplo@email.com" onChange={(e) => setPatient({ ...patient, email: e.target.value })} required />
            </p>

            <p>
              <label>CPF</label>
              <input id="cpf" type="text" placeholder="000.000.000-00" onChange={(e) => setPatient({ ...patient, cpf: e.target.value })} required />
            </p>


            <p>
              <label>Telefone</label>
              <input id="telefone" type="text" placeholder="Insira o Telefone" onChange={(e) => setPatient({ ...patient, telefone: e.target.value })} required />
            </p>

            <p>
              <label>Senha</label>
              <input id="senha" type="password" onChange={(e) => setPatient({ ...patient, senha: e.target.value })} required />
            </p>

            <button className="buttonSucess" type="button" onClick={registerPatient} disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>

        )}


        {telaLogin && (
          <form onSubmit={(e) => e.preventDefault()}>

            <p>Para logar coloque as informações abaixo</p>
            <input type='email' placeholder='Digite seu email' onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} />
            <br />
            <br />
            <input type='password' placeholder='Digite sua senha' onChange={(e) => setDoctor({ ...doctor, senha: e.target.value })} />
            <button
              type="button" className="buttonSucess" onClick={logar} disabled={loading} >
              {loading ? "Entrando..." : "Login"}
            </button>

          </form>
        )}

        <div >

          {telaLogin && (
            <>
              <p className='txtCadastrar'>Cadastre-se</p>
              <div className="btnMedicoPaciente">
                <button onClick={() => { setTelaLogin(false); setSouMedico(true) }}>Sou médico</button>
                <button onClick={() => { setTelaLogin(false); setSouMedico(false) }} >Sou paciente</button>
              </div>
            </>
          )}
          {!telaLogin && (
            <button onClick={() => setTelaLogin(!telaLogin)}>Voltar para Login</button>
          )}


        </div>


      </div>

    </main>
  );

}

export default User;
