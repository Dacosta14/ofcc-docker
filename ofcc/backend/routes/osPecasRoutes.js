const express = require("express")
const router = express.Router()

const osPecasController = require("../controllers/osPecasController")

router.get("/", osPecasController.listarOsPecas)
router.get("/:id_os_peca", osPecasController.buscarOsPecaPorID)
router.post("/", osPecasController.cadastrarOsPeca)
router.put("/:id_os_peca", osPecasController.atualizarOsPeca)
router.delete("/:id_os_peca", osPecasController.excluirOsPeca)

module.exports = router