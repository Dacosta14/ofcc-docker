const connection = require("../db")

function listarServicos(req, res) {
    connection.query(
        "SELECT * FROM servicos",
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao listar serviços"
                })
            }

            return res.status(200).json(resultado)
        }
    )
}

function buscarServicoPorID(req, res) {
    const { id_servico } = req.params

    const sql = "SELECT * FROM servicos WHERE id_servico = ?"

    connection.query(sql, [id_servico], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({
                erro: "Erro ao buscar serviço"
            })
        }

        if (resultado.length === 0) {
            return res.status(404).json({
                erro: "Serviço não encontrado"
            })
        }

        return res.status(200).json(resultado[0])
    })
}

function cadastrarServico(req, res) {
      console.log("ENTROU NO SERVICOS")
    console.log(req.body)
    const { descricao, valor } = req.body

    const sql =
        "INSERT INTO servicos (descricao, valor) VALUES (?, ?)"

    connection.query(
        sql,
        [descricao, valor],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao cadastrar serviço"
                })
            }

            return res.status(201).json({
                mensagem: "Serviço cadastrado com sucesso",
                id_servico: resultado.insertId
            })
        }
    )
}

function atualizarServico(req, res) {
    const { id_servico } = req.params
    const { descricao, valor } = req.body

    const sql =
        "UPDATE servicos SET descricao = ?, valor = ? WHERE id_servico = ?"

    connection.query(
        sql,
        [descricao, valor, id_servico],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao atualizar serviço"
                })
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Serviço não encontrado"
                })
            }

            return res.status(200).json({
                mensagem: "Serviço atualizado"
            })
        }
    )
}

function excluirServico(req, res) {
    const { id_servico } = req.params

    const sql =
        "DELETE FROM servicos WHERE id_servico = ?"

    connection.query(
        sql,
        [id_servico],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao excluir serviço"
                })
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Serviço não encontrado"
                })
            }

            return res.status(200).json({
                mensagem: "Serviço excluído"
            })
        }
    )
}

module.exports = {
    listarServicos,
    buscarServicoPorID,
    cadastrarServico,
    atualizarServico,
    excluirServico
}