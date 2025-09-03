// Payment.js
import Button from 'react-bootstrap/Button';

import { useState } from 'react';
import { replace, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../User';

function Payment() {
  const navigate = useNavigate();

  const [payment, setPayment] = useState({
    tipo_pagamento: '',
    patient_id: '',
    doctor_id: ''
  });

 
  const [payments, setPayments] = useState([]);

 
  async function fazerPagamento() {
    try {
      const { data: dU, error: eU } = await supabase.auth.getUser();
      const uid = dU?.user?.id;

      if (!uid) {
        navigate('/login', { replace: true });
        return;
      }

      const novoPagamento = {
        tipo_pagamento: payment.tipo_pagamento,
        patient_id: uid
      };

      const { data, error } = await supabase
        .from('payment')
        .insert([novoPagamento])
        .select('*');

      if (error) {
        console.error('Erro ao salvar pagamento:', error);
        alert('Erro ao salvar pagamento');
      } else {
        alert('Pagamento salvo com sucesso!');
        setPayment({ tipo_pagamento: '', patient_id: '', doctor_id: '' });
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  }

  
  async function listarPagamento() {
    try {
      const { data, error } = await supabase
        .from('payment')
        .select('*');

      if (error) {
        console.error('Erro ao listar pagamentos:', error);
        alert('Erro ao buscar pagamentos');
      } else {
        setPayments(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado ao listar:', err);
    }
  }

  return (
    <div className="screen">
      <h2>Resumo da Consulta</h2>
      

      <form>
        <input
          type="text"
          placeholder="Cartão/Pix"
          value={payment.tipo_pagamento}
          onChange={(e) => setPayment({ ...payment, tipo_pagamento: e.target.value })}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            fazerPagamento();
          }}
        >
          Salvar
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            listarPagamento();
          }}
        >
          Buscar
        </button>
      </form>

      <div>
        <h3>Pagamentos Cadastrados:</h3>
        {payments.length === 0 && <p>Nenhum pagamento encontrado.</p>}

        {payments.map((pagamento) => (
          <div key={pagamento.id} className="payment-item" onClick={() => (`/payment/${pagamento.id}`, { replace: true })}>

            <p><strong>Tipo:</strong> {pagamento.tipo_pagamento}</p>
            <p><strong>ID do Usuário:</strong> {pagamento.user_id}</p>
            <Button variant="danger">Danger</Button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Payment;
