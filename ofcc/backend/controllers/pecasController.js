const connection = require("../db")

function listarPecas(req, res) {
    connection.query(
        "SELECT * FROM pecas",
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao listar peças"
                })
            }

            return res.status(200).json(resultado)
        }
    )
}

function buscarPecaPorID(req, res) {
    const { id_peca } = req.params

    const sql = "SELECT * FROM pecas WHERE id_peca = ?"

    connection.query(sql, [id_peca], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({
                erro: "Erro ao buscar peça"
            })
        }

        if (resultado.length === 0) {
            return res.status(404).json({
                erro: "Peça não encontrada"
            })
        }

        return res.status(200).json(resultado[0])
    })
}

function cadastrarPeca(req, res) {
    const { nome, valor, loja } = req.body

    const sql =
        "INSERT INTO pecas (nome, valor, loja) VALUES (?, ?, ?)"

    connection.query(
        sql,
        [nome, valor, loja],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao cadastrar peça"
                })
            }

            return res.status(201).json({
                mensagem: "Peça cadastrada com sucesso",
                id_peca: resultado.insertId
            })
        }
    )
}

function atualizarPeca(req, res) {
    const { id_peca } = req.params
    const { nome, valor, loja } = req.body

    const sql = `
        UPDATE pecas
        SET nome = ?, valor = ?, loja = ?
        WHERE id_peca = ?
    `

    connection.query(
        sql,
        [nome, valor, loja, id_peca],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({
                    erro: "Erro ao atualizar peça"
                })
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Peça não encontrada"
                })
            }

            return res.status(200).json({
                mensagem: "Peça atualizada com sucesso"
            })
        }
    )
}

function deletarPeca(req, res) {
    const { id_peca } = req.params

    const sql = "DELETE FROM pecas WHERE id_peca = ?"

    connection.query(sql, [id_peca], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({
                erro: "Erro ao deletar peça"
            })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: "Peça não encontrada"
            })
        }

        return res.status(200).json({
            mensagem: "Peça deletada com sucesso"
        })
    })
}

module.exports = {
    listarPecas,
    buscarPecaPorID,
    cadastrarPeca,
    atualizarPeca,
    deletarPeca
}