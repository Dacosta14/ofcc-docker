const connection = require("../db")

function listarpecas(req, res){
    connection.query("SELECT * FROM pecas",
        (erro, resultado)=>{
            if (erro){
                console.log(erro)
                return res.status(500).json({erro: "Erro ao listar pecas"})
            } else {
                console.log(resultado)
                return res.status(200).json({resultado: "Peças listadas com sucesso"})

            }
        }
    )
}

function buscarPecasPorID(req, res){
    const {id_peca} = req.params

    const sql = "SELECT * FROM pecas where id_peca = ?"
    connection.query(sql, [id_peca],(erro, resultado)=>{
        if (erro){
            console.log(erro)
            return res.status(500).json({erro: "Erro ao encontrar peca"})
        }
        if (resultado.length === 0){
            return res.status(404).json({erro: "peça não encontrada"})
        }
        console.log(resultado)
        return res.status(200).json({resultado: "peça encontrada com sucesso"})

             return res.status(200).json(resultado[0])
    })
}

function cadastrarPeca(req, res) {
    const { nome, valor, loja } = req.body

    const sql = "INSERT INTO pecas (nome, valor, loja) VALUES (?, ?, ?)"

    connection.query(sql, [nome, valor, loja], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao cadastrar peça" })
        }

        return res.status(201).json({
            resultado: "Peça cadastrada com sucesso",
            id_peca: resultado.insertId
        })
    })
}

function atualizarPeca(req, res) {
    const {id_peca} = req.params
    const {nome, valor, loja} = req.body

    const sql = "UPDATE pecas SET nome = ?, valor = ?, loja = ? WHERE id_peca = ?"
    connection.query(sql, [nome, valor, loja, id_peca], (erro, resultado)=>{
        if (erro){
            console.log(erro)
            return res.status(500).json({erro: "Erro ao atualizar peça"})
        }
        console.log(resultado)
        return res.status(200).json({resultado: "Peça atualizada com sucesso"})
    })
}

function deletarPeca(req, res){
    const {id_peca} = req.params

    const sql =  "DELETE FROM pecas WHERE id_peca = ?"
    connection.query(sql, [id_peca], (erro, resultado)=>{
        if (erro){
            console.log(erro)
            return res.status(500).json({erro: "Erro ao deletar peça"})
        }
        console.log(resultado)
        return res.status(200).json({resultado: "Peça deletada com sucesso"})
    })
}

module.exports = {
    listarpecas,
    buscarPecasPorID,
    cadastrarPeca,
    atualizarPeca,
    deletarPeca
}