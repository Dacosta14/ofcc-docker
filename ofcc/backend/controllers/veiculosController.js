const connection = require("../db")

function listarVeiculos(req, res) {
    const sql = "SELECT * FROM veiculos"

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao listar veículos" })
        }

        return res.status(200).json(resultado)
    })
}

function buscarVeiculoPorID(req, res) {
    const { id_veiculo } = req.params

    const sql = "SELECT * FROM veiculos WHERE id_veiculo = ?"

    connection.query(sql, [id_veiculo], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar veículo" })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Veículo não encontrado" })
        }

        return res.status(200).json(resultado[0])
    })
}

function cadastrarVeiculo(req, res) {
    const { modelo, placa, ano, cliente_id } = req.body

    const sql = `
        INSERT INTO veiculos (modelo, placa, ano, cliente_id)
        VALUES (?, ?, ?, ?)
    `

    connection.query(sql, [modelo, placa, ano, cliente_id], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao cadastrar veículo" })
        }

        return res.status(201).json({
            resultado: "Veículo cadastrado com sucesso",
            id_veiculo: resultado.insertId
        })
    })
}

function atualizarVeiculo(req, res) {
    const { id_veiculo } = req.params
    const { modelo, placa, ano, cliente_id } = req.body

    const sql = `
        UPDATE veiculos
        SET modelo = ?, placa = ?, ano = ?, cliente_id = ?
        WHERE id_veiculo = ?
    `

    connection.query(sql, [modelo, placa, ano, cliente_id, id_veiculo], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao atualizar veículo" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Veículo não encontrado" })
        }

        return res.status(200).json({
            resultado: "Veículo atualizado com sucesso"
        })
    })
}

function excluirVeiculo(req, res) {
    const { id_veiculo } = req.params

    const sql = "DELETE FROM veiculos WHERE id_veiculo = ?"

    connection.query(sql, [id_veiculo], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao excluir veículo" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Veículo não encontrado" })
        }

        return res.status(200).json({
            resultado: "Veículo excluído com sucesso"
        })
    })
}

module.exports = {
    listarVeiculos,
    buscarVeiculoPorID,
    cadastrarVeiculo,
    atualizarVeiculo,
    excluirVeiculo
}