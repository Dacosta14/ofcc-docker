const connection = require("../db")

function buscarRelatorio(req, res) {
    const { id_os } = req.params

    const sql = `
        SELECT
            os.id_os,
            os.data_abertura,
            os.status_os,
            os.descricao,
            os.valor_total,

            c.nome,
            c.cpf,
            c.telefone,

            v.modelo,
            v.placa,
            v.ano

        FROM ordens_servico os

        JOIN veiculos v
            ON os.veiculo_id = v.id_veiculo

        JOIN clientes c
            ON v.cliente_id = c.id_cliente

        WHERE os.id_os = ?
    `

    connection.query(sql, [id_os], (erro, ordem) => {

        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar relatório"
            })
        }

        if (ordem.length === 0) {
            return res.status(404).json({
                erro: "OS não encontrada"
            })
        }

        const sqlPecas = `
            SELECT
                p.nome,
                op.quantidade,
                op.subtotal

            FROM os_pecas op

            JOIN pecas p
                ON op.peca_id = p.id_peca

            WHERE op.os_id = ?
        `

        connection.query(sqlPecas, [id_os], (erro, pecas) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar peças"
                })
            }

            const sqlServicos = `
                SELECT
                    s.descricao,
                    oss.subtotal

                FROM os_servicos oss

                JOIN servicos s
                    ON oss.servico_id = s.id_servico

                WHERE oss.os_id = ?
            `

            connection.query(
                sqlServicos,
                [id_os],
                (erro, servicos) => {

                    if (erro) {
                        return res.status(500).json({
                            erro: "Erro ao buscar serviços"
                        })
                    }

                   return res.status(200).json({
    ordem: {
        id_os: ordem[0].id_os,
        data_abertura: ordem[0].data_abertura,
        status_os: ordem[0].status_os,
        descricao: ordem[0].descricao,
        valor_total: ordem[0].valor_total
    },

    cliente: {
        nome: ordem[0].nome,
        cpf: ordem[0].cpf,
        telefone: ordem[0].telefone
    },

    veiculo: {
        modelo: ordem[0].modelo,
        placa: ordem[0].placa,
        ano: ordem[0].ano
    },

    pecas,
    servicos
})
                }
            )
        })
    })
}

module.exports = {
    buscarRelatorio
}