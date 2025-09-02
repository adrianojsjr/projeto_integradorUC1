// Payment.js
import Button from 'react-bootstrap/Button';

import { useState } from 'react';
import { replace, useNavigate, useLocation, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../User';

function Payment() {
  const nav = useNavigate();
   const { id: agendaId } = useParams(); // id da agenda
  const location = useLocation(); //informações da URL atual.
  const idMedico = new URLSearchParams(location.search); //transforma a query string em objeto fácil de ler.
  const doctorId = idMedico.get('doctorId'); // id do médico

  // Estado para armazenar os dados do pagamento
  const [payment, setPayment] = useState({
    tipo_pagamento: '',
    patient_id: '',
    doctor_id: ''
  });

  // Estado para armazenar os pagamentos buscados
  const [payments, setPayments] = useState([]);

  // Função para salvar o pagamento no Supabase
  async function fazerPagamento() {
    try {
      const { data: dU, error: eU } = await supabase.auth.getUser();
      const uid = dU?.user?.id;

      if (!uid) {
        nav('/login', { replace: true });
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

  // Função para listar todos os pagamentos
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
      <h2>Cadastro de Pagamento</h2>

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
          Confirmar pagamento
        </button>

        <Button onClick={() => nav(`/doctors/${doctorId}`, { replace: true })} > Escolher outro horário </Button>


      </form>

    </div>
  );
}

export default Payment;
