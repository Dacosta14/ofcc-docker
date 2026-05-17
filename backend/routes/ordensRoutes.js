const express = require("express")
const router = express.Router()

const ordensController = require("../controllers/ordensController")
router.get("/", ordensController.listarOrdens)
router.get("/:id_os", ordensController.buscarOrdemPorID)
router.post("/", ordensController.cadastrarOrdem)
router.put("/:id_os", ordensController.atualizarOrdem)
router.delete("/:id_os", ordensController.deletarOrdem)

module.exports = router