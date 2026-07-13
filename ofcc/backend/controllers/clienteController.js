const connection = require("../db");

async function buscarDetalhesCliente(req, res) {
  const { id } = req.params;

  try {
    const [cliente] = await connection
      .promise()
      .query(
        "SELECT id_cliente, nome, cpf, telefone FROM clientes WHERE id_cliente = ?",
        [id],
      );

    if (cliente.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    const [veiculos] = await connection
      .promise()
      .query(
        "SELECT id_veiculo, modelo, placa, ano FROM veiculos WHERE cliente_id = ?",
        [id],
      );

    const [ordens] = await connection.promise().query(
      `SELECT 
        os.id_os,
        os.descricao,
        os.status_os,
        os.valor_total,
        os.data_abertura,
        v.modelo AS veiculo_modelo,
        v.placa AS veiculo_placa
      FROM ordens_servico os
      LEFT JOIN veiculos v ON os.veiculo_id = v.id_veiculo
      WHERE v.cliente_id = ?
      ORDER BY os.data_abertura DESC`,
      [id],
    );

    res.json({
      cliente: cliente[0],
      veiculos,
      ordens,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar detalhes do cliente" });
  }
}

function listarClientes(req, res) {
  connection.query("SELECT * FROM clientes", (erro, resultado) => {
    if (erro) {
      console.log(erro);
      return res.status(500).json({ erro: "Erro ao listar clientes" });
    }
    return res.status(200).json(resultado);
  });
}

function buscarClientePorId(req, res) {
  const { id_cliente } = req.params;
  const sql = "SELECT * FROM clientes WHERE id_cliente = ?";

  connection.query(sql, [id_cliente], (erro, resultado) => {
    if (erro) {
      console.log(erro);
      return res.status(500).json({ erro: "Erro ao buscar cliente" });
    }
    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }
    return res.status(200).json(resultado[0]);
  });
}

function cadastrarCliente(req, res) {
  const { nome, cpf, telefone } = req.body;
  const sql = "INSERT INTO clientes (nome, cpf, telefone) VALUES (?, ?, ?)";

  connection.query(sql, [nome, cpf, telefone], (erro, resultado) => {
    if (erro) {
      console.log(erro);
      return res.status(500).json({ erro: "Erro ao cadastrar cliente" });
    }
    return res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso",
      id_cliente: resultado.insertId,
    });
  });
}

function atualizarCliente(req, res) {
  const { id_cliente } = req.params;
  const { nome, cpf, telefone } = req.body;

  const sql = `
    UPDATE clientes
    SET nome = ?, cpf = ?, telefone = ?
    WHERE id_cliente = ?
  `;

  connection.query(
    sql,
    [nome, cpf, telefone, id_cliente],
    (erro, resultado) => {
      if (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Erro ao atualizar cliente" });
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "Cliente não encontrado" });
      }
      return res
        .status(200)
        .json({ mensagem: "Cliente atualizado com sucesso" });
    },
  );
}

function deletarCliente(req, res) {
  const { id_cliente } = req.params;

  connection.query(
    `DELETE os FROM ordens_servico os
     INNER JOIN veiculos v ON os.veiculo_id = v.id_veiculo
     WHERE v.cliente_id = ?`,
    [id_cliente],
    (erro) => {
      if (erro) {
        console.log(erro);
        return res
          .status(500)
          .json({ erro: "Erro ao deletar ordens do cliente" });
      }

      connection.query(
        "DELETE FROM veiculos WHERE cliente_id = ?",
        [id_cliente],
        (erro) => {
          if (erro) {
            console.log(erro);
            return res
              .status(500)
              .json({ erro: "Erro ao deletar veículos do cliente" });
          }

          connection.query(
            "DELETE FROM clientes WHERE id_cliente = ?",
            [id_cliente],
            (erro, resultado) => {
              if (erro) {
                console.log(erro);
                return res
                  .status(500)
                  .json({ erro: "Erro ao deletar cliente" });
              }
              if (resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Cliente não encontrado" });
              }
              return res
                .status(200)
                .json({ mensagem: "Cliente deletado com sucesso" });
            },
          );
        },
      );
    },
  );
}

module.exports = {
  listarClientes,
  buscarClientePorId,
  cadastrarCliente,
  atualizarCliente,
  deletarCliente,
  buscarDetalhesCliente,
};
