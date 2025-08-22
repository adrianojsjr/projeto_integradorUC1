import './App.css';
import { use, useState } from 'react';
import './resultadoBusca.css';
import './logo_teste.png';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

const supabase = createClient(supabaseUrl, supabaseKey);

function Doctor() { //javaScript

  const [doctors, setDoctors] = useState([])


  async function listarMedicos() {

    let { data: dataDoctors, error } = await supabase
      .from('doctors')
      .select('*')
    setDoctors(dataDoctors);

  }



  return ( //html
    <main>

      <div className="inicio">
        <div className="menuBusca">
          <div></div>
          <div className="busca">
            <input type="text" placeholder="Especialidade ou médico" />
            <a className="btn">Filtros</a>
            <button className="btn" onClick={listarMedicos}>Buscar</button>

          </div>
          <div></div>
        </div>

      </div>

      {doctors.map(
        medico => (
          <div key={medico.id}>

            <div class="alinhamentoPagina">

              <div id="cardInfoConsulta" class="cardInfoConsulta">

                <img src={medico.imagem}/>
                {medico.nome}<br />
                {medico.especialidade}

                <div class="calendario">
                  <h3>Disponibilidade</h3>
                  <p>Selecione o dia e horário de sua preferência para o atendimento</p>

                  <div class="disponibilidade">

                    <div class="dataDisponivel">
                      <a class="btnData" href=""><span id="dataDisponivel"></span> às <span
                        id="horaDisponivel"></span></a>

                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        )

      )
      }

    </main>
  );

}
export default Doctor;
