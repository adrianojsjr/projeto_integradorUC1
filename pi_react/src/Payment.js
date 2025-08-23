// import logo from './logo.svg';
// import {useState} from 'react';
// import './App.css';

import logo from './logo.svg';
import './App.css';
import './user.css'
import { use, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { replace, useNavigate } from 'react-router-dom';

const supabaseUrl = "https://mayrahcoiqpxrhqtcnry.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU"
const supabase = createClient(supabaseUrl, supabaseKey);



function Payment() {                  //aqui javascript
  const nav = useNavigate();

  const [payment, setpayment] = useState({
    tipo_pagamento: '',
    user_id: ''


  })





  async function fazerPagamento() {

    const { data: dU, error: eU } = await supabase.auth.getUser();

    const uid = dU?.user.id

    if(!uid) nav("/login" , {replace: true})

    // if (eU) nav('/login', { replace: true })
    // if (!dU) nav('login', { replace: true })
    // if (dU && !dU.id) nav('/login', { replace: true })


    const { data, error } = await supabase
      .from('payment')
      .insert([
        payment
      ])
      .select()

  }
  return (                         /* Aqui html */
    <div className="screen">

      <form>
        <input type="text"  placeholder='Digite o Tipo de Pagamento : Cartão ou Pix' onChange={(e) => setpayment({ ...payment, tipo_pagamento: e.target.value })} />
        {/* <button onClick={fazerPagamento()}>Salvar</button> */}
        <button onClick={(e) => { e.preventDefault(); fazerPagamento(); }}>Salvar</button>
      </form>












    </div>
  );
}


export default Payment;