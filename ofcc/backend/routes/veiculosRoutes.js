const express = require("express")
const router = express.Router()

const veiculosController = require("../controllers/veiculosController")

router.get("/", veiculosController.listarVeiculos)
router.get("/:id_veiculo", veiculosController.buscarVeiculoPorID)
router.post("/", veiculosController.cadastrarVeiculo)
router.put("/:id_veiculo", veiculosController.atualizarVeiculo)
router.delete("/:id_veiculo", veiculosController.excluirVeiculo)

module.exports = router