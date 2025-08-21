import logo from './logo.svg';
import './App.css';
import './cadastroMedico.css'
import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

const supabase = createClient(supabaseUrl, supabaseKey);


function Schedule() {                  //aqui javascript
  const nav = useNavigate();
  const [schedule, setSchedule] = useState({
    status: "",
    avaliacao: "",
    doctor_id: "",
    patient_id: "",
    payment_id: "",
  })

  async function creatSchedule() {
    const { data: dU, error: eU } = await supabase.auth.getUser();
   
    const uid = dU?.user?.id;
   
    if (!uid) nav("/user", {replace: true});

    /*if (eU) nav('/user', { replace: true })
    if (!dU) nav('/user', { replace: true })
    if (dU && !dU.id) nav('/user', { replace: true })*/

    console.log ({...schedule, user_id: uid})

    const { data, error } = await supabase
      .from('schedule')
      .insert({...schedule, user_id: uid});
      //.select();
        
      
  }


  return (                         /* Aqui html */
    <div className="Screen">
      <form onSubmit={(e)=> e.preventDefault()}>
        <input type="text" placeholder="status" onChange={(e) => setSchedule({ ...schedule, status: e.target.value })} required />
        <input type="text" placeholder="avaliacao" onChange={(e) => setSchedule({ ...schedule, avaliacao: e.target.value })} required />
        <input type="text" placeholder="doctor_id" onChange={(e) => setSchedule({ ...schedule, doctor_id: e.target.value })} required />
        <input type="text" placeholder="patient_id" onChange={(e) => setSchedule({ ...schedule, patient_id: e.target.value })} required />
        <input type="text" placeholder="payment_id" onChange={(e) => setSchedule({ ...schedule, payment_id: e.target.value })} required />

        <button onClick={creatSchedule}>Salvar</button>
      </form>


    </div>
  );
}


export default Schedule;