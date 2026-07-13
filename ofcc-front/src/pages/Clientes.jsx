import { useState, useEffect } from "react";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [detalhesCliente, setDetalhesCliente] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [veiculoEditando, setVeiculoEditando] = useState(null);

  const [etapaCadastro, setEtapaCadastro] = useState(null); 
  const [clienteRecem, setClienteRecem] = useState(null); 

  const [formCliente, setFormCliente] = useState({
    nome: "",
    cpf: "",
    telefone: "",
  });
  const [formVeiculo, setFormVeiculo] = useState({
    modelo: "",
    placa: "",
    ano: "",
  });

  useEffect(() => {
    buscarClientes();
  }, []);

  function buscarClientes() {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }



  function abrirModalNovo() {
    setClienteEditando(null);
    setFormCliente({ nome: "", cpf: "", telefone: "" });
    setFormVeiculo({ modelo: "", placa: "", ano: "" });
    setClienteRecem(null);
    setEtapaCadastro("cliente");
  }

  function fecharModalCadastro() {
    setEtapaCadastro(null);
    setClienteRecem(null);
    setFormCliente({ nome: "", cpf: "", telefone: "" });
    setFormVeiculo({ modelo: "", placa: "", ano: "" });
  }

  function salvarCliente() {
    if (clienteEditando) {
      fetch(`http://localhost:3000/clientes/${clienteEditando.id_cliente}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCliente),
      }).then(() => {
        buscarClientes();
        fecharModalCadastro();
        setClienteEditando(null);
      });
    } else {
      fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formCliente),
      })
        .then((res) => res.json())
        .then((data) => {
          setClienteRecem({
            id_cliente: data.id_cliente,
            nome: formCliente.nome,
          });
          setEtapaCadastro("veiculo");
        });
    }
  }

  function salvarVeiculo() {
    fetch("http://localhost:3000/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formVeiculo,
        ano: Number(formVeiculo.ano),
        cliente_id: clienteRecem.id_cliente,
      }),
    }).then(() => {
      buscarClientes();
      fecharModalCadastro();
    });
  }

  function pularVeiculo() {
    buscarClientes();
    fecharModalCadastro();
  }

  function abrirModalEditar(cliente, event) {
    event.stopPropagation();
    setClienteEditando(cliente);
    setFormCliente({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
    });
    setEtapaCadastro("cliente");
  }

  function excluirCliente(id, event) {
    event.stopPropagation();
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cliente?",
    );
    if (!confirmar) return;
    fetch(`http://localhost:3000/clientes/${id}`, { method: "DELETE" }).then(
      () => {
        setClientes(clientes.filter((c) => c.id_cliente !== id));
      },
    );
  }

  function excluirVeiculo(idVeiculo, event) {
    event.stopPropagation();
    const confirmar = window.confirm("Excluir este veículo?");
    if (!confirmar) return;
    fetch(`http://localhost:3000/veiculos/${idVeiculo}`, {
      method: "DELETE",
    }).then(() => {
      setDetalhesCliente((prev) => ({
        ...prev,
        veiculos: prev.veiculos.filter((v) => v.id_veiculo !== idVeiculo),
      }));
    });
  }

  function abrirEdicaoVeiculo(veiculo, event) {
    event.stopPropagation();
    setVeiculoEditando(veiculo);
    setFormVeiculo({
      modelo: veiculo.modelo,
      placa: veiculo.placa,
      ano: String(veiculo.ano),
    });
  }

  function salvarEdicaoVeiculo() {
    fetch(`http://localhost:3000/veiculos/${veiculoEditando.id_veiculo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formVeiculo,
        ano: Number(formVeiculo.ano),
        cliente_id: clienteSelecionado.id_cliente,
      }),
    }).then(() => {
      setDetalhesCliente((prev) => ({
        ...prev,
        veiculos: prev.veiculos.map((v) =>
          v.id_veiculo === veiculoEditando.id_veiculo
            ? { ...v, ...formVeiculo, ano: Number(formVeiculo.ano) }
            : v,
        ),
      }));
      setVeiculoEditando(null);
      setFormVeiculo({ modelo: "", placa: "", ano: "" });
    });
  }

  function adicionarVeiculoNoCliente() {
    setFormVeiculo({ modelo: "", placa: "", ano: "" });
    setClienteRecem(clienteSelecionado);
    setEtapaCadastro("veiculo_extra");
  }

  function salvarVeiculoExtra() {
    fetch("http://localhost:3000/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formVeiculo,
        ano: Number(formVeiculo.ano),
        cliente_id: clienteSelecionado.id_cliente,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDetalhesCliente((prev) => ({
          ...prev,
          veiculos: [
            ...prev.veiculos,
            {
              id_veiculo: data.id_veiculo,
              ...formVeiculo,
              ano: Number(formVeiculo.ano),
            },
          ],
        }));
        setEtapaCadastro(null);
        setClienteRecem(null);
        setFormVeiculo({ modelo: "", placa: "", ano: "" });
      });
  }


  function abrirDetalhesCliente(cliente) {
    setClienteSelecionado(cliente);
    fetch(`http://localhost:3000/clientes/${cliente.id_cliente}/detalhes`)
      .then((res) => res.json())
      .then((data) => setDetalhesCliente(data))
      .catch(() => setDetalhesCliente({ cliente, veiculos: [], ordens: [] }));
  }

  function fecharDetalhesCliente() {
    setClienteSelecionado(null);
    setDetalhesCliente(null);
    setVeiculoEditando(null);
  }

  function corStatus(status) {
    if (status === "Aberta")
      return "text-yellow-400 bg-yellow-900/20 border-yellow-800/40";
    if (status === "Em andamento")
      return "text-blue-400 bg-blue-900/20 border-blue-800/40";
    if (status === "Concluída")
      return "text-green-400 bg-green-900/20 border-green-800/40";
    return "text-gray-400 bg-gray-800 border-gray-700";
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-xl shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-wide text-red-500">
            Cadastro
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-bold text-white">Clientes</h1>
              <p className="mt-2 text-sm text-gray-400">
                Clientes cadastrados no sistema da oficina.
              </p>
            </div>
            <div className="flex items-end gap-4">
              <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                <p className="text-xs text-gray-400">Total de clientes</p>
                <p className="text-2xl font-bold text-red-500">
                  {clientes.length}
                </p>
              </div>
              <button
                onClick={abrirModalNovo}
                className="rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                + Novo cliente
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <div
              key={cliente.id_cliente}
              onClick={() => abrirDetalhesCliente(cliente)}
              className="cursor-pointer rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-red-900/70 hover:bg-gray-900/80"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/30 text-lg font-bold text-red-500">
                  {cliente.nome?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold text-white">
                    {cliente.nome}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-400">
                      CPF: <span className="text-gray-200">{cliente.cpf}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Tel:{" "}
                      <span className="text-gray-200">{cliente.telefone}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => abrirModalEditar(cliente, e)}
                      className="rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-gray-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => excluirCliente(cliente.id_cliente, e)}
                      className="rounded bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-900/70"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {etapaCadastro === "cliente" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white">
              {clienteEditando
                ? "Editar cliente"
                : "Novo cliente — Etapa 1 de 2"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {clienteEditando
                ? "Atualize os dados do cliente."
                : "Dados pessoais do cliente."}
            </p>
            <div className="mt-5 space-y-3">
              <input
                placeholder="Nome"
                value={formCliente.nome}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, nome: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="CPF"
                value={formCliente.cpf}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, cpf: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="Telefone"
                value={formCliente.telefone}
                onChange={(e) =>
                  setFormCliente({ ...formCliente, telefone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={fecharModalCadastro}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={salvarCliente}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                {clienteEditando ? "Salvar alterações" : "Próximo →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(etapaCadastro === "veiculo" || etapaCadastro === "veiculo_extra") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white">
              {etapaCadastro === "veiculo"
                ? "Novo cliente — Etapa 2 de 2"
                : "Adicionar veículo"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {etapaCadastro === "veiculo"
                ? `Cadastre o veículo de ${clienteRecem?.nome}.`
                : `Adicionar veículo para ${clienteSelecionado?.nome}.`}
            </p>
            <div className="mt-5 space-y-3">
              <input
                placeholder="Modelo (ex: Gol)"
                value={formVeiculo.modelo}
                onChange={(e) =>
                  setFormVeiculo({ ...formVeiculo, modelo: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="Placa (ex: ABC1234)"
                value={formVeiculo.placa}
                onChange={(e) =>
                  setFormVeiculo({ ...formVeiculo, placa: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="Ano (ex: 2020)"
                value={formVeiculo.ano}
                onChange={(e) =>
                  setFormVeiculo({ ...formVeiculo, ano: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              {etapaCadastro === "veiculo" && (
                <button
                  onClick={pularVeiculo}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700"
                >
                  Pular por enquanto
                </button>
              )}
              {etapaCadastro === "veiculo_extra" && (
                <button
                  onClick={() => {
                    setEtapaCadastro(null);
                    setClienteRecem(null);
                  }}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={
                  etapaCadastro === "veiculo"
                    ? salvarVeiculo
                    : salvarVeiculoExtra
                }
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Cadastrar veículo
              </button>
            </div>
          </div>
        </div>
      )}

      {clienteSelecionado && detalhesCliente && !etapaCadastro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-red-500">
                  Detalhes do cliente
                </p>
                <h2 className="mt-1 text-3xl font-bold text-white">
                  {detalhesCliente.cliente.nome}
                </h2>
              </div>
              <button
                onClick={fecharDetalhesCliente}
                className="rounded bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">CPF</p>
                <p className="mt-1 font-semibold text-gray-200">
                  {detalhesCliente.cliente.cpf}
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="mt-1 font-semibold text-gray-200">
                  {detalhesCliente.cliente.telefone}
                </p>
              </div>
            </div>

            {/* Veículos */}
            <div className="mt-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Veículos</h3>
              <button
                onClick={adicionarVeiculoNoCliente}
                className="rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-700"
              >
                + Adicionar veículo
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {detalhesCliente.veiculos?.length > 0 ? (
                detalhesCliente.veiculos.map((veiculo) =>
                  veiculoEditando?.id_veiculo === veiculo.id_veiculo ? (
                    <div
                      key={veiculo.id_veiculo}
                      className="rounded-lg border border-red-900/40 bg-gray-950 p-4 space-y-2"
                    >
                      <input
                        placeholder="Modelo"
                        value={formVeiculo.modelo}
                        onChange={(e) =>
                          setFormVeiculo({
                            ...formVeiculo,
                            modelo: e.target.value,
                          })
                        }
                        className="w-full rounded border border-gray-800 bg-gray-900 p-2 text-white text-sm outline-none focus:border-red-800"
                      />
                      <input
                        placeholder="Placa"
                        value={formVeiculo.placa}
                        onChange={(e) =>
                          setFormVeiculo({
                            ...formVeiculo,
                            placa: e.target.value,
                          })
                        }
                        className="w-full rounded border border-gray-800 bg-gray-900 p-2 text-white text-sm outline-none focus:border-red-800"
                      />
                      <input
                        placeholder="Ano"
                        value={formVeiculo.ano}
                        onChange={(e) =>
                          setFormVeiculo({
                            ...formVeiculo,
                            ano: e.target.value,
                          })
                        }
                        className="w-full rounded border border-gray-800 bg-gray-900 p-2 text-white text-sm outline-none focus:border-red-800"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setVeiculoEditando(null)}
                          className="rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={salvarEdicaoVeiculo}
                          className="rounded bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={veiculo.id_veiculo}
                      className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white">
                            {veiculo.modelo}
                          </p>
                          <p className="mt-1 text-sm text-gray-400">
                            {veiculo.placa} • {veiculo.ano}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => abrirEdicaoVeiculo(veiculo, e)}
                            className="rounded bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) =>
                              excluirVeiculo(veiculo.id_veiculo, e)
                            }
                            className="rounded bg-red-900/40 px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-900/70"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum veículo vinculado.
                </p>
              )}
            </div>

            {/* Ordens */}
            <h3 className="mt-6 text-lg font-bold text-white">
              Ordens de serviço
            </h3>
            <div className="mt-3 space-y-3">
              {detalhesCliente.ordens?.length > 0 ? (
                detalhesCliente.ordens.map((ordem) => (
                  <div
                    key={ordem.id_os}
                    className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          OS #{ordem.id_os}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {ordem.descricao}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded border px-2 py-0.5 text-xs font-medium ${corStatus(ordem.status_os)}`}
                        >
                          {ordem.status_os}
                        </span>
                      </div>
                      <p className="font-bold text-red-500">
                        R$ {Number(ordem.valor_total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhuma ordem vinculada.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;
