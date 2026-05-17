const express = require("express")
const router = express.Router()

const pecasController = require("../controllers/pecasController")

router.get("/", pecasController.listarpecas)
router.get("/:id_peca", pecasController.buscarPecasPorID)
router.post("/", pecasController.cadastrarPeca)
router.put("/:id_peca", pecasController.atualizarPeca)
router.delete("/:id_peca", pecasController.deletarPeca)

module.exports = router