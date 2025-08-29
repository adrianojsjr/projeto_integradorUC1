import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';


const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"

const supabase = createClient(supabaseUrl, supabaseKey);


function Schedule() {                  //aqui javascript
  const nav = useNavigate();
  const [schedule, setSchedule] = useState({
    dateTime: "",
    doctor_id: ""
  })

  async function creatSchedule() {
    const { data: dU, error: eU } = await supabase.auth.getUser();

    const uid = dU?.user?.uid

    if (!uid) nav("/user", { replace: true });

    /*if (eU) nav('/user', { replace: true })
    if (!dU) nav('/user', { replace: true })
    if (dU && !dU.id) nav('/user', { replace: true })*/

    const { data, error } = await supabase
      .from('schedule')
      .insert({ ...schedule, doctor_id: uid });
    //.select();


  }

  async function delSchedule(id) {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('supra_id', id)
  }

  return (                         /* Aqui html */
    <div className="Screen">
      <form>
        <input type="dateime-local" placeholder="data" onChange={(e) => setSchedule({ ...schedule, date: e.target.value })} required />

        <button onClick={creatSchedule}>Salvar</button>
      </form>

      <Button variant="danger" onClick={() => delSchedule(schedule.id)}>Deletar</Button>
      <Button variant="warning">Editar</Button>

    </div>
  );
}


export default Schedule;