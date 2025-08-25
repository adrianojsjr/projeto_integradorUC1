// Payment.js
import './Payment.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// 🔐 Use variáveis de ambiente em produção!
const supabaseUrl = 'https://mayrahcoiqpxrhqtcnry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXJhaGNvaXFweHJocXRjbnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTAzMzgsImV4cCI6MjA2OTkyNjMzOH0.8jpiw7cQHMy4KaBl5qquKBptbjfO1FqtdE7u7X2C_OU';
const supabase = createClient(supabaseUrl, supabaseKey);

function Payment() {
  const navigate = useNavigate();

  // Estado para armazenar os dados do pagamento
  const [payment, setPayment] = useState({
    tipo_pagamento: '',
    user_id: '',
  });

  // Estado para armazenar os pagamentos buscados
  const [payments, setPayments] = useState([]);

  // Função para salvar o pagamento no Supabase
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
        user_id: uid,
      };

      const { data, error } = await supabase
        .from('payment')
        .insert([novoPagamento])
        .select();

      if (error) {
        console.error('Erro ao salvar pagamento:', error);
        alert('Erro ao salvar pagamento');
      } else {
        alert('Pagamento salvo com sucesso!');
        setPayment({ tipo_pagamento: '', user_id: '' });
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
          placeholder="Digite o Tipo de Pagamento: Cartão ou Pix"
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
          <div key={pagamento.id} className="payment-item">
            <p><strong>Tipo:</strong> {pagamento.tipo_pagamento}</p>
            <p><strong>ID do Usuário:</strong> {pagamento.user_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Payment;
