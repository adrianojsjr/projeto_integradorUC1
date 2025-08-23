import './App.css';
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

import './doctor.css';

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

const supabase = createClient(supabaseUrl, supabaseKey);


function Doctor() { //javaScript

  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    listarMedicos()
  }, [])



  async function listarMedicos(filtro = null) {

    if (filtro) {

      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('especialidade', filtro)
        setDoctors(dataDoctors);

    } else {
      let { data: dataDoctors, error } = await supabase
        .from('doctors')
        .select('*')
        setDoctors(dataDoctors);
    }

  }



  return ( //html
    <main>

      <div className="inicio">
        <div className="menuBusca">
          <div></div>
          <div className="busca">
            <input type="text" placeholder="Especialidade ou médico" />
            <button className="btn" onClick={() => listarMedicos("Dermatologista")}>Dermatologista</button>
            <button className="btn" onClick={() => listarMedicos("Cardiologista")}>Cardiologista</button>
            <button className="btn" onClick={() => listarMedicos("Endocrinologista")}>Endocrinologista</button>
            <button className="btn" onClick={() => listarMedicos()}>Buscar Todos</button>
          </div>
          <div></div>
        </div>

      </div>

      {doctors.map(
        medico => (
          <div key={medico.id}>

            <div class="alinhamentoPagina">

              <div class="cardInfoConsulta">

                <div>

                  <img src={medico.imagem} />
                  {medico.nome}<br />
                  {medico.especialidade}

                </div>

                <div class="calendario">

                  <h3>Disponibilidade</h3>
                  <p>Selecione o dia e horário de sua preferência para o atendimento</p>

                  <div class="disponibilidade">

                    <div class="dataDisponivel">
                      <a class="btn" href=""><span>   </span> às <span>   </span></a>

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
