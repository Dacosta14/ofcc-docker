const connection = require("../db")

function listarOsPecas(req, res) {
    const sql = "SELECT * FROM os_pecas"

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao listar peças da ordem" })
        }

        return res.status(200).json(resultado)
    })
}

function buscarOsPecaPorID(req, res) {
    const { id_os_peca } = req.params

    const sql = "SELECT * FROM os_pecas WHERE id_os_peca = ?"

    connection.query(sql, [id_os_peca], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar peça da ordem" })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Peça da ordem não encontrada" })
        }

        return res.status(200).json(resultado[0])
    })
}

function cadastrarOsPeca(req, res) {
    const { os_id, peca_id, quantidade, subtotal } = req.body

    const sql = `
        INSERT INTO os_pecas (os_id, peca_id, quantidade, subtotal)
        VALUES (?, ?, ?, ?)
    `

    connection.query(sql, [os_id, peca_id, quantidade, subtotal], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao cadastrar peça na ordem" })
        }

        return res.status(201).json({
            resultado: "Peça adicionada na ordem com sucesso",
            id_os_peca: resultado.insertId
        })
    })
}

function atualizarOsPeca(req, res) {
    const { id_os_peca } = req.params
    const { os_id, peca_id, quantidade, subtotal } = req.body

    const sql = `
        UPDATE os_pecas
        SET os_id = ?, peca_id = ?, quantidade = ?, subtotal = ?
        WHERE id_os_peca = ?
    `

    connection.query(sql, [os_id, peca_id, quantidade, subtotal, id_os_peca], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao atualizar peça da ordem" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Peça da ordem não encontrada" })
        }

        return res.status(200).json({ resultado: "Peça da ordem atualizada com sucesso" })
    })
}

function excluirOsPeca(req, res) {
    const { id_os_peca } = req.params

    const sql = "DELETE FROM os_pecas WHERE id_os_peca = ?"

    connection.query(sql, [id_os_peca], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao excluir peça da ordem" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Peça da ordem não encontrada" })
        }

        return res.status(200).json({ resultado: "Peça da ordem excluída com sucesso" })
    })
}

module.exports = {
    listarOsPecas,
    buscarOsPecaPorID,
    cadastrarOsPeca,
    atualizarOsPeca,
    excluirOsPeca
}