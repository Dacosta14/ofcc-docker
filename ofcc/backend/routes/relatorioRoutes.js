const express = require("express")
const router = express.Router()

const relatorioController = require("../controllers/relatorioController")

router.get("/ordem/:id_os", relatorioController.buscarRelatorio)

module.exports = router