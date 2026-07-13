const express = require("express");
const router = express.Router();

const clientesController = require("../controllers/clienteController");

router.get("/", clientesController.listarClientes);
router.get("/:id_cliente", clientesController.buscarClientePorId);
router.post("/", clientesController.cadastrarCliente);
router.put("/:id_cliente", clientesController.atualizarCliente);
router.delete("/:id_cliente", clientesController.deletarCliente);
router.get("/:id/detalhes", clientesController.buscarDetalhesCliente);

module.exports = router;
