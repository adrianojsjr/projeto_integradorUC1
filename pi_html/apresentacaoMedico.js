
let usuarioMedico = {
    id: 1,
    nome: "Dra. Juliana Ferraz",
    imagem: "https://placeholder.pics/svg/300x150",
    especialidade: "Endocrinologista",
    descricaoEspecialidade: "Especializado (a) no diagnóstico e tratamento de doenças relacionadas ao sistema endócrino, que inclui glândulas produtoras de hormônios como a tireoide, as adrenais e o pâncreas. Eles cuidam de condições como diabetes, problemas de tireoide, obesidade, distúrbios do crescimento e puberdade, e também podem tratar doenças ósseas metabólicas",
    experiencia: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora animi neque similique nostrum, sapiente maiores dolorum hic odit assumenda ad temporibus molestias magnam dignissimos nemo fugiat quos distinctio. Veniam, unde",
    valorConsulta: "R$ 130",
    avaliacao: 5,
    dataDisponivel: "12/10/2025",
    horaDisponivel: "10:00"

}

let usuarioPaciente = {
    id: 2,
    nome: "Mariana Amelia Rocha ",
    email: "mariana@gmail.com ",
    cpf: "12345678912",
    telefone: "16988178562",
    senha: "123456",
    avaliacoes: "Atendimento excelente!",
    avaliacaoEstrela: 5,
    consultas: "20-07-2025 Dra. Juliana Ferraz"

}

informacoesConsulta()

function informacoesConsulta() {
    document.querySelector("#nomeMedico").innerHTML = usuarioMedico.nome
    document.querySelector("#descricaoEspecialidade").innerHTML = usuarioMedico.descricaoEspecialidade
    document.querySelector("#experiencia").innerHTML = usuarioMedico.experiencia
    document.querySelector("#dataDisponivel").innerHTML = usuarioMedico.dataDisponivel
    document.querySelector("#horaDisponivel").innerHTML = usuarioMedico.horaDisponivel
    document.querySelector("#avaliacaoDescricao").innerHTML = usuarioPaciente.avaliacoes
    document.querySelector("#pacienteNome").innerHTML = usuarioPaciente.nome
    document.querySelector("#avaliacaoEstrela").innerHTML = usuarioPaciente.avaliacaoEstrela
    document.querySelector("#dataConsulta").innerHTML = usuarioPaciente.consultas.split(" ")[0]
}

mostrarApresentacaoMedico()



function mostrarApresentacaoMedico() {
    document.querySelector("#esconderApresentacao").style.display = "block"
    document.querySelector("#cadastro-container").style.display = "none"
    document.querySelector("#login-container").style.display = "none"


}


function esconderApresentacaoMedico() {
    document.querySelector("#esconderApresentacao").style.display = "none"
    document.querySelector("#cadastro-container").style.display = "flex"
}

function cadastrar(e) {
    e.preventDefault()

    usuarioPaciente.nome = document.querySelector("#inputNome").value
    usuarioPaciente.email = document.querySelector("#inputEmail").value
    usuarioPaciente.cpf = document.querySelector("#inputCpf").value
    usuarioPaciente.telefone = document.querySelector("#inputTelefone").value
    usuarioPaciente.senha = document.querySelector("#inputSenha").value
    document.querySelector("#cadastro-container").style.display = "none"
    document.querySelector("#login-container").style.display = "flex"

}


