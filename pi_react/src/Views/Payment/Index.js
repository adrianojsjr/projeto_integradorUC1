// Payment.js
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { replace, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../User/Index';

// Componente de pagamento para gerenciar transações
function Payment() {
  // Hook para navegação entre rotas
  const navigate = useNavigate();

  // Estado para armazenar os dados do pagamento atual
  const [payment, setPayment] = useState({
    tipo_pagamento: '',     // Tipo de pagamento (Cartão/Pix)
    patient_id: '',         // ID do paciente
    doctor_id: ''           // ID do médico (não utilizado na função fazerPagamento)
  });

  // Estado para armazenar a lista de pagamentos recuperados
  const [payments, setPayments] = useState([]);

  // Função assíncrona para processar um novo pagamento
  async function fazerPagamento() {
    try {
      // Obtém informações do usuário autenticado
      const { data: dU, error: eU } = await supabase.auth.getUser();
      const uid = dU?.user?.id;

      // Redireciona para login se usuário não estiver autenticado
      if (!uid) {
        navigate('/login', { replace: true });
        return;
      }

      // Prepara objeto do novo pagamento
      const novoPagamento = {
        tipo_pagamento: payment.tipo_pagamento,
        patient_id: uid  // Usa o ID do usuário autenticado
      };

      // Insere o pagamento no banco de dados Supabase
      const { data, error } = await supabase
        .from('payment')
        .insert([novoPagamento])
        .select('*');

      // Trata erros na inserção
      if (error) {
        console.error('Erro ao salvar pagamento:', error);
        alert('Erro ao salvar pagamento');
      } else {
        // Sucesso na inserção
        alert('Pagamento salvo com sucesso!');
        // Reseta o formulário
        setPayment({ tipo_pagamento: '', patient_id: '', doctor_id: '' });
      }
    } catch (err) {
      // Captura erros inesperados
      console.error('Erro inesperado:', err);
    }
  }

  // Função assíncrona para listar todos os pagamentos
  async function listarPagamento() {
    try {
      // Busca todos os registros da tabela payment
      const { data, error } = await supabase
        .from('payment')
        .select('*');

      // Trata erros na consulta
      if (error) {
        console.error('Erro ao listar pagamentos:', error);
        alert('Erro ao buscar pagamentos');
      } else {
        // Atualiza estado com os pagamentos recuperados
        setPayments(data || []);
      }
    } catch (err) {
      // Captura erros inesperados
      console.error('Erro inesperado ao listar:', err);
    }
  }

  // Renderização do componente
  return (
    <div className="screen">
      <h2>Resumo da Consulta</h2>
      
      {/* Formulário de pagamento */}
      <form>
        {/* Input para tipo de pagamento */}
        <input
          type="text"
          placeholder="Cartão/Pix"
          value={payment.tipo_pagamento}
          onChange={(e) => setPayment({ ...payment, tipo_pagamento: e.target.value })}
        />

        {/* Botão para salvar pagamento */}
        <button
          onClick={(e) => {
            e.preventDefault();  // Previne comportamento padrão do formulário
            fazerPagamento();
          }}
        >
          Salvar
        </button>

        {/* Botão para buscar pagamentos */}
        <button
          onClick={(e) => {
            e.preventDefault();  // Previne comportamento padrão do formulário
            listarPagamento();
          }}
        >
          Buscar
        </button>
      </form>

      {/* Seção de exibição dos pagamentos */}
      <div>
        <h3>Pagamentos Cadastrados:</h3>
        
        {/* Mensagem quando não há pagamentos */}
        {payments.length === 0 && <p>Nenhum pagamento encontrado.</p>}

        {/* Mapeia e exibe cada pagamento */}
        {payments.map((pagamento) => (
          <div key={pagamento.id} className="payment-item" onClick={() => (`/payment/${pagamento.id}`, { replace: true })}>
            {/* Exibe informações do pagamento */}
            <p><strong>Tipo:</strong> {pagamento.tipo_pagamento}</p>
            <p><strong>ID do Usuário:</strong> {pagamento.user_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Payment;