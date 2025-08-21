import './App.css';
import { use, useState } from 'react';
import './resultadoBusca.css'
import './logo_teste.png'


function Doctor() { //javaScript

  //inserir todos os campos que tem na tela de cadatro
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
    ativo: "",
    imagem: ""
  });

  //inserir todos os campos que tem na tela de cadatro
  const [patient, setPatient] = useState({
    email: "",
    senha: "",
    telefone: "",
    nome: "",
    cpf: "",
    endereco: "",
    ativo: ""
  });


function buscar() {
  const dadosBuscados = {
    imagem: "https://placeholder.pics/svg/300x150",
    nome: "Dr. João",
    especialidade: "Cardiologia",
    dataDisponivel: "25/08/2025",
    horaDisponivel: "14:00",
    avaliacao: "5"
  };

  setDoctor(dadosBuscados);
}
  return ( //html
    <main>

      <div className="inicio">
        <div className="menuBusca">
          <div></div>
          <div className="busca">
            <input type="text" placeholder="Especialidade ou médico" />
            <a className="btn">Filtros</a>
            <a className="btn" onClick={buscar}>Buscar</a>
          </div>
          <div></div>
        </div>

      </div>

      <div className="alinhamentoPagina">

        <div id="cardInfoConsulta" className="cardInfoConsulta">

          <div className="infoConsulta">
            <img src={doctor.imagem} alt="Foto do médico" />
            <a href="./apresentacaoMedico.html"><h3>{doctor.nome}</h3></a>
            <p><span id="especialidadeMedico">{doctor.especialidade}</span> <br/> Avaliação <span id="avaliacao">{doctor.avaliacao}</span>
              <br /><br /><span id="valorConsulta"></span>
            </p>
          </div>

          <div className="calendario">

            <h3>Disponibilidade</h3>
            <p>Selecione o dia e horário de sua preferência para o atendimento</p>

            <div className="disponibilidade">
              <div className="dataDisponivel">
                <a className="btnData" href=""><span id="dataDisponivel">{doctor.dataDisponivel}</span> às <span
                  id="horaDisponivel">{doctor.horaDisponivel}</span></a>

              </div>
            </div>

          </div >

        </div >
      </div>
    </main>
  );

}
export default Doctor;
