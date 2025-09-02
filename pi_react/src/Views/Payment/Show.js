// Payment.js
import Button from 'react-bootstrap/Button';

import { useState } from 'react';
import { replace, useNavigate, useLocation, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import "./payment.css";

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
    <main className='alinhamentoPagina'>
      <p>Resumo da consulta</p>
      <Button onClick={() => nav(`/doctors/${doctorId}`, { replace: true })}>
          Escolher outro horário
        </Button>

      <form>
        <label>Escolha a forma de pagamento:</label>
        <select
          value={payment.tipo_pagamento}
          onChange={(e) => setPayment({ ...payment, tipo_pagamento: e.target.value })}
          required
        >
          <option value="">Selecione...</option>
          <option value="cartao">Cartão de Crédito</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boleto</option>
        </select>  
      </form>

      {payment.tipo_pagamento === 'cartao' && (
        <div className="cartao">
          <h3>Pagamento com Cartão</h3>
          <form>
            <div className="dadosComprador">
              <label>Nome completo</label>
              <input type="text" id="nome" placeholder="Nome do titular" required />

              <label>CPF</label>
              <input type="text" id="cpf" placeholder="000.000.000-00" required />

              <label>Número do Cartão</label>
              <input type="text" id="numero" placeholder="XXXX XXXX XXXX XXXX" required />

              <div className="validadeCVV">
                <div className="cartaoValidade">
                  <label>Validade</label>
                  <input type="text" id="validade" placeholder="MM/AA" required />
                </div>

                <div className="cartaoCVV">
                  <label>CVV</label>
                  <input type="text" id="cvv" placeholder="123" required />
                </div>
              </div>
            </div>

            <button
          onClick={(e) => {
            e.preventDefault();
            fazerPagamento();
          }}
        >
          Confirmar pagamento
        </button>
          </form>
        </div>
      )}
      {payment.tipo_pagamento === 'pix' && (
        <div className="pix">
          <h3>Pagamento por Pix</h3>
          <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento-fake"
            alt="QR Code Pix"
          />
          <p>Ou copie a chave Pix: <strong>pagamento@consulta.com</strong></p>
        </div>
      )}
      {payment.tipo_pagamento === 'boleto' && (
        <div className="boleto">
          <h3>Pagamento via Boleto Bancário</h3>
          <p>
            Clique no botão abaixo para gerar o boleto. Após o pagamento, pode levar até
            <strong> 3 dias úteis </strong> para a confirmação.
          </p>
          <button type="button" onClick={() => alert("Boleto gerado com sucesso!")}>
            Gerar Boleto
          </button>
        </div>
      )}
    </main>
  );
}

export default Payment;
