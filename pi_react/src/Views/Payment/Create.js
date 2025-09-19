// Payment.js
//import './Style.css';

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Button from 'react-bootstrap/Button';

import { supabase } from '../User/Index';

function PaymentCreate() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const [scheduleId, setScheduleId] = useState();
  const [doctorId, setDoctorId] = useState();

  const [payment, setPayment] = useState({ tipo_pagamento: '' });
  const [doctor, setDoctor] = useState(null);
  const [agenda, setAgenda] = useState(null);

  const [msg, setMsg] = useState(''); // mensagem para exibir na tela
  const msgTimer = useRef(null); // para controlar o tempo da mensagem

  useEffect(() => {
    const sId = searchParams.get('scheduleId');
    const dId = searchParams.get('doctorId');

    setScheduleId(sId);
    setDoctorId(dId);

    lerAgenda(sId);
    lerDoctor(dId);
  }, []);

  // efeito para rolar a tela e sumir a mensagem
  useEffect(() => {
    if (msg) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (msgTimer.current) clearTimeout(msgTimer.current);
      msgTimer.current = setTimeout(() => setMsg(''), 3000);
    }
    return () => {
      if (msgTimer.current) clearTimeout(msgTimer.current);
    };
  }, [msg]);

  async function lerDoctor(id) {
    const { data: dataDoctor, error } = await supabase
      .from('doctors')
      .select('*, especialidade(nome)')
      .eq('supra_id', id)
      .single();

    if (!error) setDoctor(dataDoctor);
  }

  async function lerAgenda(id) {
    const { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) setAgenda(dataSchedule);
  }

  async function fazerPagamento() {
    try {
      const { data: dU } = await supabase.auth.getUser();
      const uid = dU?.user?.id;

      if (!uid) {
        nav('/login', { replace: true });
        return;
      }

      const novoPagamento = { tipo_pagamento: payment.tipo_pagamento, patient_id: uid };
      const { data, error } = await supabase
        .from('payment')
        .insert([novoPagamento])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao salvar pagamento:', error);
        setMsg('Erro ao salvar pagamento!');
        return null;
      } else {
        setPayment({ tipo_pagamento: '' });
        return data.id;
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setMsg('Erro inesperado ao processar pagamento.');
      return null;
    }
  }

  async function updateSchedule(idPagamento) {
    const { data: dU } = await supabase.auth.getUser();
    const uid = dU?.user?.id;

    const { data, error } = await supabase
      .from('schedule')
      .update({ status: 'Indisponível', statusPatient: "Agendada", patient_id: uid, payment_id: idPagamento })
      .eq('id', scheduleId)
      .select('*')
      .single();

    if (!error) {
      setAgenda(prev => ({
        ...prev,
        displayStatus: 'Consulta agendada!',
        patient_id: uid,
        payment_id: idPagamento
      }));
      setMsg('Consulta agendada com sucesso!');
    } else {
      console.error('Erro ao atualizar agendamento:', error);
      setMsg('Erro ao atualizar agendamento.');
    }
  }

  async function updatePayment(idPagamento) {
    const { data: dataP, error: errorP } = await supabase
      .from('payment')
      .update({ status: 'Pago' })
      .eq('id', idPagamento)
      .select('*')
      .single();

    if (!errorP) {
      const { data: dU } = await supabase.auth.getUser();
      const uid = dU?.user?.id;
      setAgenda(prev => ({
        ...prev,
        displayStatus: 'Consulta agendada!',
        patient_id: uid,
        payment_id: idPagamento
      }));
      setMsg('Pagamento confirmado e consulta agendada!');
    } else {
      console.error('Erro ao atualizar pagamento:', errorP);
      setMsg('Erro ao confirmar pagamento.');
    }
  }

  async function finalizarAgendamento() {
    const { data: dU } = await supabase.auth.getUser();
    const uid = dU?.user?.id;
    const idPagamento = await fazerPagamento();

    if (scheduleId && idPagamento) {
      await updateSchedule(idPagamento);
      await updatePayment(idPagamento);
      setTimeout(() => nav(`/schedule/${uid}`), 4000);
    } else {
      setMsg('Erro no agendamento.');
    }
  }

  function formatarData(data) {
    const date = new Date(data);
    const dataFormatada = date.toLocaleDateString('pt-BR');
    const horaFormatada = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dataFormatada} ${horaFormatada}`;
  }
  return (
    <div className="alinhamentoPagina">
      {msg && <div className="msgFeedback">{msg}</div>}

      <div className='consultaPagamento'>
        <div className='infoConsultaPagamento'>
          <h3>Resumo da Consulta</h3>
          <img
            src={doctor?.fotoPerfil?.[0]?.url || '/imagens/avatar-generico.png'}
            alt="Foto do médico"
          />
          <p>{doctor ? doctor.nome : ''}<br /></p>
          {doctor?.especialidade?.nome}<br />
          <p>R$ 30,00</p>
          <p>{agenda ? (agenda.displayStatus || formatarData(agenda.date)) : ''}</p>
          <button className='btnGeral' onClick={() => nav(`/doctors/${doctorId}`, { replace: true })}>
            Escolher outro horário
          </button>
        </div>

        <div className="pagamento">
          <form className='formaPagamento'>
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
            <div className="cartaoPixBoleto">
              <h3>Pagamento com Cartão</h3>
              <form>
                <label>Nome completo</label>
                <input type="text" placeholder="Nome do titular" required />
                <label>CPF</label>
                <input type="text" placeholder="000.000.000-00" required />
                <label>Número do Cartão</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />

                <div className="validadeCVV">
                  <div className="cartaoValidade">
                    <label>Validade</label>
                    <input type="text" placeholder="MM/AA" required />
                  </div>
                  <div className="cartaoCVV">
                    <label>CVV</label>
                    <input type="text" placeholder="123" required />
                  </div>
                </div>

                <button className='btnGeral' onClick={(e) => { e.preventDefault(); finalizarAgendamento(); }}>
                  Confirmar pagamento
                </button>
              </form>
            </div>
          )}

          {payment.tipo_pagamento === 'pix' && (
            <div className="cartaoPixBoleto">
              <h3>Pagamento por Pix</h3>
              <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento-fake" alt="QR Code Pix" />
              <p>Ou copie a chave Pix: <strong>pagamento@consulta.com</strong></p>
              <button className='btnGeral' type="button" onClick={(e) => { e.preventDefault(); finalizarAgendamento(); }}>
                Concluir
              </button>
            </div>
          )}

          {payment.tipo_pagamento === 'boleto' && (
            <div className="cartaoPixBoleto">
              <h3>Pagamento via Boleto Bancário</h3>
              <p>
                Clique no botão abaixo para gerar o boleto. Após o pagamento, pode levar até <strong>3 dias úteis</strong> para a confirmação.
              </p>
              <button className='btnGeral' type="button" onClick={(e) => { e.preventDefault(); finalizarAgendamento(); }}>
                Gerar Boleto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentCreate;
