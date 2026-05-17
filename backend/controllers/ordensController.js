const connection = require("../db")

function listarOrdens(req, res){
    connection.query("SELECT * FROM ordens_servico",
         (erro, resultado)=>{
        if (erro) {
                 console.log(erro)
            return res.status(500).json({erro: "Erro ao listar ordens"})
        } else {
            console.log(resultado)
            return res.status(200).json({resultado: "Ordens listadas com sucesso"})
        }
    })
}

function buscarOrdemPorID(req, res) {
    const { id_os } = req.params

    const sql = "SELECT * FROM ordens_servico WHERE id_os = ?"

    connection.query(sql, [id_os], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao buscar ordem" })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Ordem não encontrada" })
        }

        return res.status(200).json(resultado[0])
    })
}
function cadastrarOrdem(req, res) {
    const {
        id_cliente,
        id_veiculo,
        id_servico,
        id_peca,
        data_abertura,
        status_os,
        descricao,
        valor_total
    } = req.body

    const sql = `
        INSERT INTO ordens_servico 
        (id_cliente, id_veiculo, id_servico, id_peca, data_abertura, status_os, descricao, valor_total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    connection.query(
        sql,
        [id_cliente, id_veiculo, id_servico, id_peca, data_abertura, status_os, descricao, valor_total],
        (erro, resultado) => {
            if (erro) {
                console.log(erro)
                return res.status(500).json({ erro: "Erro ao cadastrar ordem" })
            }

            return res.status(201).json({
                resultado: "Ordem cadastrada com sucesso",
                id_os: resultado.insertId
            })
        }
    )
}

function atualizarOrdem(req, res) {
    const { id_os } = req.params
    const {
        id_cliente,
        id_veiculo,
        id_servico,
        id_peca,
        data_abertura,
        status_os,
        descricao,
        valor_total
    } = req.body 

    const sql = "UPDATE ordens_servico SET id_cliente = ?, id_veiculo = ?, id_servico = ?, id_peca = ?, data_abertura = ?, status_os = ?, descricao = ?, valor_total = ? WHERE id_os = ?"
    connection.query(sql, [id_cliente, id_veiculo, id_servico, id_peca, data_abertura, status_os, descricao, valor_total, id_os], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao atualizar ordem" })
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Ordem não encontrada" })
        }   

        return res.status(200).json({ resultado: "Ordem atualizada com sucesso" })
    })
}

function deletarOrdem(req, res) {
    const { id_os } = req.params  

    const sql = "DELETE FROM ordens_servico WHERE id_os = ?"
    connection.query(sql, [id_os], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ erro: "Erro ao deletar ordem" })
        }
        else if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Ordem não encontrada" })
        }   
        return res.status(200).json({ resultado: "Ordem deletada com sucesso" })
    })
}      
module.exports = {
    listarOrdens,
    buscarOrdemPorID,
    cadastrarOrdem,
    atualizarOrdem,
    deletarOrdem
}