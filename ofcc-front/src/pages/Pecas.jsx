import { useState, useEffect } from "react";

function Pecas() {
  const [pecas, setPecas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pecaEditando, setPecaEditando] = useState(null);

  const [formPeca, setFormPeca] = useState({
    nome: "",
    valor: "",
    loja: "",
  });

  useEffect(() => {
    buscarPecas();
  }, []);

  function buscarPecas() {
    fetch("http://localhost:3000/pecas")
      .then((res) => res.json())
      .then((data) => setPecas(data));
  }

  function abrirModalNovo() {
    setPecaEditando(null);
    setFormPeca({ nome: "", valor: "", loja: "" });
    setModalAberto(true);
  }

  function abrirModalEditar(peca, event) {
    event.stopPropagation();
    setPecaEditando(peca);
    setFormPeca({ nome: peca.nome, valor: peca.valor, loja: peca.loja });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setPecaEditando(null);
    setFormPeca({ nome: "", valor: "", loja: "" });
  }

  function salvarPeca() {
    if (pecaEditando) {
      fetch(`http://localhost:3000/pecas/${pecaEditando.id_peca}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPeca),
      }).then(() => {
        buscarPecas();
        fecharModal();
      });
    } else {
      fetch("http://localhost:3000/pecas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPeca),
      }).then(() => {
        buscarPecas();
        fecharModal();
      });
    }
  }

  function excluirPeca(id, event) {
    event.stopPropagation();
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta peça?",
    );
    if (!confirmar) return;

    fetch(`http://localhost:3000/pecas/${id}`, {
      method: "DELETE",
    }).then(() => {
      setPecas(pecas.filter((p) => p.id_peca !== id));
    });
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-xl shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-wide text-red-500">
            Estoque
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-bold text-white">Peças</h1>
              <p className="mt-2 text-sm text-gray-400">
                Peças disponíveis no estoque da oficina.
              </p>
            </div>
            <div className="flex items-end gap-4">
              <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                <p className="text-xs text-gray-400">Total em estoque</p>
                <p className="text-2xl font-bold text-red-500">
                  {pecas.length}
                </p>
              </div>
              <button
                onClick={abrirModalNovo}
                className="rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                + Nova peça
              </button>
            </div>
          </div>
        </div>

        {/* Grid de peças */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pecas.map((peca) => (
            <div
              key={peca.id_peca}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-red-900/70 hover:bg-gray-900/80"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold text-white">
                    {peca.nome}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {peca.loja || "Sem loja"}
                  </p>
                  <p className="mt-3 text-xl font-bold text-green-500">
                    R$ {Number(peca.valor).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => abrirModalEditar(peca, e)}
                  className="rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-gray-700"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => excluirPeca(peca.id_peca, e)}
                  className="rounded bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-900/70"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal cadastro / edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white">
              {pecaEditando ? "Editar peça" : "Nova peça"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {pecaEditando
                ? "Atualize os dados da peça."
                : "Cadastre uma nova peça no estoque."}
            </p>

            <div className="mt-5 space-y-3">
              <input
                placeholder="Nome da peça"
                value={formPeca.nome}
                onChange={(e) =>
                  setFormPeca({ ...formPeca, nome: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="Valor (ex: 49.90)"
                value={formPeca.valor}
                onChange={(e) =>
                  setFormPeca({ ...formPeca, valor: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                placeholder="Loja (opcional)"
                value={formPeca.loja}
                onChange={(e) =>
                  setFormPeca({ ...formPeca, loja: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={fecharModal}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={salvarPeca}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                {pecaEditando ? "Salvar alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pecas;
