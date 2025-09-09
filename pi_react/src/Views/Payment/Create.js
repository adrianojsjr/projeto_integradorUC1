// Payment.js
//import './Style.css';

import { useEffect, useState } from 'react';
import { replace, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Button from 'react-bootstrap/Button';

import { supabase } from '../../User';

function PaymentCreate() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [scheduleId, setScheduleId] = useState()
  const [doctorId, setDoctorId] = useState()

  // Estado para armazenar os dados do pagamento
  const [payment, setPayment] = useState({
    tipo_pagamento: '',
    patient_id: '',
    doctor_id: '',
    user_id: ''
  });

  const [doctor, setDoctor] = useState(null);
  const [agenda, setAgenda] = useState(null);

  // Estado para armazenar os pagamentos buscados
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setDoctorId(searchParams.get('doctorId'))
    lerDoctor(searchParams.get('doctorId'))
    setScheduleId(searchParams.get('scheduleId'))
    lerAgenda(searchParams.get('scheduleId'))
  }, [])


  async function lerDoctor(id) {
    console.log(id)
    let { data: dataDoctor, error } = await supabase
      .from('doctors')
      .select('*, especialidade(nome)')
      .eq('supra_id', id)
      .single()

    setDoctor(dataDoctor); // Atualiza o estado com os dados do médico
  }


  async function lerAgenda(id) {

    let { data: dataSchedule, error } = await supabase
      .from('schedule')
      .select('*') // Seleciona todos os campos + nome do médico
      .eq('id', id) // Filtra pelo ID do médico
      .single();

    setAgenda(dataSchedule || []); // Atualiza estado
  }

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
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao salvar pagamento:', error);
        alert('Erro ao salvar pagamento');
      } else {
        alert('Pagamento salvo com sucesso!');
        setPayment({ tipo_pagamento: '', patient_id: '', doctor_id: '' });
        console.log(data)
        return data.id
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  }

  function formatarData(data) {
    const date = new Date(data)

    const dataFormatada =

      date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const horaFormatada =

      date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    return `${dataFormatada} ${horaFormatada}`;

    //poderia ser também return dataFormatada + ' ' + horaFormatada;
  }


  async function updateSchedule(idPagamento) {

    const { data: dU, error: eU } = await supabase.auth.getUser();
    const uid = dU?.user?.id;

    console.log("idPagamento: " + idPagamento);
    console.log("scheduleId: " + scheduleId);

    const { data, error } = await supabase
      .from('schedule')
      .update({ status: 'Indisponível', patient_id: uid, payment_id: idPagamento })
      .eq('id', scheduleId)
      .select()
      .single(); // <-- garante que traga o registro atualizado


    if (error) {
      console.error('Erro ao atualizar agendamento:', error);
    } else {
      // setAgenda(data); // Atualiza estado
      console.log("Agenda atualizada:", data);

    }
  }

  async function finalizarAgendamento() {
    const idPagamento = await fazerPagamento();
    console.log("idPagamento: " + idPagamento)

    if (scheduleId) { //se a agenda existe, vai para update
      await updateSchedule(idPagamento);
      console.log("certo")
    }
    else {
      console.log('Erro no agendamento')
    }

  }

  return (
    <div className="alinhamentoPagina">
      <div className='cardInfoConsulta'>

        <div className='infoConsulta'>

          <h3>Resumo da Consulta</h3>
          <img
            src={doctor?.fotoPerfil?.[0]?.url || '/imagens/avatar-generico.png'}
            alt="Foto do médico"
          />
          <p>{doctor ? doctor.nome : ''} <br/></p>
          {doctor?.especialidade?.nome} <br/>
          <p>R$ 30,00</p>
          {agenda ? formatarData(agenda.date) : ''}<br/><br/>

          <button className='btnGeral' onClick={() => nav(`/doctors/${doctorId}`, { replace: true })}>
            Escolher outro horário
          </button>

        </div>

      </div>

      <div className="pagamento">

        <form className='formaPagamento'>
          <label >Escolha a forma de pagamento:</label>
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

              <button className='btnGeral'
                onClick={(e) => {
                  e.preventDefault();
                  finalizarAgendamento();
                }}
              >
                Confirmar pagamento
              </button>
            </form>
          </div>
        )}
        {payment.tipo_pagamento === 'pix' && (
          <div className="cartaoPixBoleto">
            <h3>Pagamento por Pix</h3>

            <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento-fake"
              alt="QR Code Pix"
            />
            <p>Ou copie a chave Pix: <strong>pagamento@consulta.com</strong></p>

            <button className='btnGeral' type="button" onClick={(e) => {
              e.preventDefault();
              finalizarAgendamento();
            }}>
              Concluir
            </button>

          </div>
        )}
        {payment.tipo_pagamento === 'boleto' && (
          <div className="cartaoPixBoleto">
            <h3>Pagamento via Boleto Bancário</h3>
            <p>
              Clique no botão abaixo para gerar o boleto. Após o pagamento, pode levar até
              <strong> 3 dias úteis </strong> para a confirmação.
            </p>
            <button className='btnGeral' type="button" onClick={(e) => {
              e.preventDefault();
              finalizarAgendamento();
            }}>
              Gerar Boleto
            </button>
          </div>
        )}
      </div>

    </div>
  );

}

export default PaymentCreate;
