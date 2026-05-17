const express = require("express")
const cors = require("cors")

const clientesRoutes = require("./routes/clientesRoutes")
const ordensRoutes = require("./routes/ordensRoutes")
const pecasRoutes = require("./routes/pecasRoutes")
const servicosRoutes = require("./routes/servicosRoutes")
const veiculosRoutes = require("./routes/veiculosRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/clientes", clientesRoutes)
app.use("/ordens", ordensRoutes)
app.use("/pecas", pecasRoutes)
app.use("/servicos", servicosRoutes)
app.use("/veiculos", veiculosRoutes)

app.get("/", (req, res) => {
    res.json({ message: "API da oficina rodando" })
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})