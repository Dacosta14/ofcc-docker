const connection = require("../db")


function listarClientes(req, res){

    connection.query(
        "select * FROM clientes",
        (erro, resultado) =>{
            if(erro){
                res.status(500).json({error: "Erro ao encontrar cliente"})
            }
            else {
                res.json(resultado)
            }
        }
    )
}
function buscarClientePorId(req, res){
    const { id_cliente } = req.params

    const sql = "SELECT * FROM clientes WHERE id_cliente = ?"

    connection.query(sql, [id_cliente], (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).json({ error: "Erro ao encontrar cliente" })
        }

        if (resultado.length === 0) {
            return res.status(404).json({ error: "Cliente not found" })
        }

        return res.json(resultado[0])
    })
}



function cadastrarCliente(req, res){
    const{nome, cpf, telefone} = req.body

    const sql = "INSERT INTO clientes (nome, cpf, telefone) VALUES (?, ?, ?)"

    connection.query(sql, [nome, cpf, telefone],
         (erro, resultado)=>{

        if(erro){
            res.status(500).json({error: "Erro ao cadastrar cliente"})
        }

        else {
            res.json({message: "Cliente cadastrado com sucesso"})
        }
    })
}

function atualizarCliente(req, res){
    const {id_cliente} = req.params
    const {nome, cpf, telefone}  = req.body

    const sql = "UPDATE clientes SET nome = ?, cpf = ?,telefone= ? WHERE id_cliente = ?"
    connection.query(sql, [nome, cpf, telefone, id_cliente], (erro, resultado)=>{
        if(erro){
            res.status(500).json({error: "Erro ao atualizar o cliente"})
        }
        else {
            res.json({message: "Cliente atualizado com sucesso"})
        }
    })


}

function deletarCliente(req, res){
    const {id_cliente} = req.params

    const sql = "DELETE FROM clientes WHERE id_cliente = ?"
    connection.query(sql, [id_cliente], (erro, resultado)=>{
        if(erro){
            res.status(500).json({error: "Erro ao deletar o cliente"})
        }
        else {
            res.json({message: "Cliente deletado com sucesso"})
        }
    })
}

module.exports = {
    listarClientes,
    buscarClientePorId,
    cadastrarCliente,
    atualizarCliente,
    deletarCliente
}