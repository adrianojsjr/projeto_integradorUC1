let usuarioMedico = {
    id: 1,
    nome: "Dra. Juliana Ferraz",
    imagem: "https://placeholder.pics/svg/300x150",
    especialidade: "Endocrinologista",
    valorConsulta: "R$ 130",
    avaliacao: 5,
    dataDisponivel: "12/10/2025",
    horaDisponivel: "10:00"
}

resumoAgendamento()


function resumoAgendamento() {
    document.querySelector("#imgMedico").src = usuarioMedico.imagem
    document.querySelector("#nomeMedico").innerHTML = usuarioMedico.nome
    document.querySelector("#especialidadeMedico").innerHTML = usuarioMedico.especialidade
    document.querySelector("#avaliacao").innerHTML = usuarioMedico.avaliacao
    document.querySelector("#valorConsulta").innerHTML = usuarioMedico.valorConsulta
    document.querySelector("#dataDisponivel").innerHTML = usuarioMedico.dataDisponivel
    document.querySelector("#horaDisponivel").innerHTML = usuarioMedico.horaDisponivel
}


