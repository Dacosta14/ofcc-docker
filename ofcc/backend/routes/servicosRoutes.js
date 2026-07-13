const express = require("express")
const router = express.Router()

const servicosController = require("../controllers/servicosController")

router.get("/", servicosController.listarServicos)
router.get("/:id_servico", servicosController.buscarServicoPorID)
router.post("/", servicosController.cadastrarServico)
router.put("/:id_servico", servicosController.atualizarServico)
router.delete("/:id_servico", servicosController.excluirServico)

module.exports = router