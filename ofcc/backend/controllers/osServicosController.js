const connection = require("../db")

function listarOsServicos(req, res) {
    const sql = "SELECT * FROM os_servicos"

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao listar serviços da ordem" })
        }

        return res.status(200).json(resultado)
    })
}

function buscarOsServicoPorID(req, res) {
    const { id_os_servico } = req.params

    const sql = "SELECT * FROM os_servicos WHERE id_os_servico = ?"

    connection.query(sql, [id_os_servico], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar serviço da ordem" })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Serviço da ordem não encontrado" })
        }

        return res.status(200).json(resultado[0])
    })
}

function cadastrarOsServico(req, res) {
      console.log("ENTROU NO OS_SERVICOS")
    console.log(req.body)

    const { os_id, servico_id, subtotal } = req.body

    const sql = `
        INSERT INTO os_servicos (os_id, servico_id, subtotal)
        VALUES (?, ?, ?)
    `

    connection.query(sql, [os_id, servico_id, subtotal], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao cadastrar serviço na ordem" })
        }

        return res.status(201).json({
            resultado: "Serviço adicionado na ordem com sucesso",
            id_os_servico: resultado.insertId
        })
    })
}

function atualizarOsServico(req, res) {
    const { id_os_servico } = req.params
    const { os_id, servico_id, subtotal } = req.body

    const sql = `
        UPDATE os_servicos
        SET os_id = ?, servico_id = ?, subtotal = ?
        WHERE id_os_servico = ?
    `

    connection.query(sql, [os_id, servico_id, subtotal, id_os_servico], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao atualizar serviço da ordem" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Serviço da ordem não encontrado" })
        }

        return res.status(200).json({ resultado: "Serviço da ordem atualizado com sucesso" })
    })
}

function excluirOsServico(req, res) {
    const { id_os_servico } = req.params

    const sql = "DELETE FROM os_servicos WHERE id_os_servico = ?"

    connection.query(sql, [id_os_servico], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao excluir serviço da ordem" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Serviço da ordem não encontrado" })
        }

        return res.status(200).json({ resultado: "Serviço da ordem excluído com sucesso" })
    })
}

module.exports = {
    listarOsServicos,
    buscarOsServicoPorID,
    cadastrarOsServico,
    atualizarOsServico,
    excluirOsServico
}