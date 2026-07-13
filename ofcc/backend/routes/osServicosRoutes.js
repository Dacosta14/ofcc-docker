const express = require("express")
const router = express.Router()

const osServicosController = require("../controllers/osServicosController")

router.get("/", osServicosController.listarOsServicos)
router.get("/:id_os_servico", osServicosController.buscarOsServicoPorID)
router.post("/", osServicosController.cadastrarOsServico)
router.put("/:id_os_servico", osServicosController.atualizarOsServico)
router.delete("/:id_os_servico", osServicosController.excluirOsServico)

module.exports = router