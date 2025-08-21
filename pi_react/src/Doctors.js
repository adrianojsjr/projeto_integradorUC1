import logo from './logo.svg';
import './App.css';
import { use, useState } from 'react';
import './resultadoBusca.css';


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




  return ( //html
    <main>

      <div class="inicio">
        <div class="menuBusca">
          <div></div>
            <div class="busca">
              <input type="text" placeholder="Especialidade ou médico" />
              <a class="btn">Filtros</a>
              <a class="btn" onclick="buscar()">Buscar</a>
            </div>
          <div></div>
        </div>

      </div>

      <div class="alinhamentoPagina">

        <div id="cardInfoConsulta" class="cardInfoConsulta">

          <div class="infoConsulta">
            <img id="imgMedico" src="" alt="" />
            <a href="./apresentacaoMedico.html"><h3 id="nomeMedico"></h3></a>
            <p><span id="especialidadeMedico"></span> <br /> Avaliação <span id="avaliacao"></span>
              <br /><br /><span id="valorConsulta"></span>
            </p>
          </div>

          <div class="calendario">
            
            <h3>Disponibilidade</h3>
            <p>Selecione o dia e horário de sua preferência para o atendimento</p>

            <div class="disponibilidade">
              <div class="dataDisponivel">
                <a class="btnData" href=""><span id="dataDisponivel"></span> às <span
                  id="horaDisponivel"></span></a>

              </div>
            </div>
          
          </div >

        </div >
      </div>
    </main>
  );

}
export default Doctor;
