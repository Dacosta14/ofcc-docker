import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Ordens() {
  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculosDoCliente, setVeiculosDoCliente] = useState([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [detalheOrdem, setDetalheOrdem] = useState(null);
  const [ordemEditando, setOrdemEditando] = useState(null);
  const [buscandoVeiculos, setBuscandoVeiculos] = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);
  const pdfRef = useRef(null);

  const [formOrdem, setFormOrdem] = useState({
    cliente_id: "",
    veiculo_id: "",
    descricao: "",
    status_os: "Aberta",
    valor_total: "",
    data_abertura: new Date().toISOString().slice(0, 10),
  });

  const abertas = ordens.filter((o) => o.status_os === "Aberta");
  const andamento = ordens.filter((o) => o.status_os === "Em andamento");
  const concluidas = ordens.filter((o) => o.status_os === "Concluída");

  useEffect(() => {
    buscarOrdens();
    buscarClientes();
  }, []);

  function buscarOrdens() {
    fetch("http://localhost:3000/ordens")
      .then((res) => res.json())
      .then((data) => setOrdens(data));
  }

  function buscarClientes() {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }

  function buscarVeiculosDoCliente(clienteId) {
    if (!clienteId) {
      setVeiculosDoCliente([]);
      return;
    }
    setBuscandoVeiculos(true);
    fetch(`http://localhost:3000/clientes/${clienteId}/detalhes`)
      .then((res) => res.json())
      .then((data) => setVeiculosDoCliente(data.veiculos || []))
      .catch(() => setVeiculosDoCliente([]))
      .finally(() => setBuscandoVeiculos(false));
  }

  function abrirModalNovo() {
    setOrdemEditando(null);
    setVeiculosDoCliente([]);
    setFormOrdem({
      cliente_id: "",
      veiculo_id: "",
      descricao: "",
      status_os: "Aberta",
      valor_total: "",
      data_abertura: new Date().toISOString().slice(0, 10),
    });
    setModalCadastroAberto(true);
  }

  function abrirModalEditar(ordem, event) {
    event.stopPropagation();
    setOrdemEditando(ordem);
    setVeiculosDoCliente([]);
    setFormOrdem({
      cliente_id: "",
      veiculo_id: String(ordem.veiculo_id),
      descricao: ordem.descricao,
      status_os: ordem.status_os,
      valor_total: String(ordem.valor_total),
      data_abertura: ordem.data_abertura?.slice(0, 10),
    });
    setModalCadastroAberto(true);
  }

  function fecharModalCadastro() {
    setModalCadastroAberto(false);
    setOrdemEditando(null);
    setVeiculosDoCliente([]);
  }

  function salvarOrdem() {
    const payload = {
      veiculo_id: Number(formOrdem.veiculo_id),
      descricao: formOrdem.descricao,
      status_os: formOrdem.status_os,
      valor_total: Number(formOrdem.valor_total),
      data_abertura: formOrdem.data_abertura,
    };
    if (ordemEditando) {
      fetch(`http://localhost:3000/ordens/${ordemEditando.id_os}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(() => {
        buscarOrdens();
        fecharModalCadastro();
      });
    } else {
      fetch("http://localhost:3000/ordens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(() => {
        buscarOrdens();
        fecharModalCadastro();
      });
    }
  }

  function excluirOrdem(ordem, event) {
    event.stopPropagation();
    if (ordem.status_os === "Concluída") {
      alert("Não é possível excluir uma ordem já concluída.");
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir esta OS?")) return;
    fetch(`http://localhost:3000/ordens/${ordem.id_os}`, {
      method: "DELETE",
    }).then(() => setOrdens(ordens.filter((o) => o.id_os !== ordem.id_os)));
  }

  function abrirDetalhe(ordem) {
    fetch(`http://localhost:3000/relatorio/ordem/${ordem.id_os}`)
      .then((res) => res.json())
      .then((data) => {
        setDetalheOrdem(data);
        setModalDetalheAberto(true);
      });
  }

  function fecharDetalhe() {
    setModalDetalheAberto(false);
    setDetalheOrdem(null);
  }

  async function gerarPDF() {
    if (!pdfRef.current) return;
    setGerandoPDF(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
        windowWidth: pdfRef.current.scrollWidth,
        windowHeight: pdfRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const finalHeight = Math.min(imgHeight, pageHeight);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(
        `OS_${detalheOrdem.ordem?.id_os}_${detalheOrdem.cliente?.nome}.pdf`,
      );
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGerandoPDF(false);
    }
  }

  function CardOrdem({ ordem }) {
    return (
      <div
        onClick={() => abrirDetalhe(ordem)}
        className="cursor-pointer rounded-xl border border-gray-800 bg-gray-900 p-4 mb-3 shadow-lg shadow-black/20 transition hover:border-red-900/70 hover:bg-gray-900/80"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">OS #{ordem.id_os}</p>
          <p className="mt-1 text-sm text-gray-400 truncate">
            {ordem.descricao}
          </p>
          <p className="mt-2 text-base font-bold text-red-400">
            R$ {Number(ordem.valor_total).toFixed(2)}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => abrirModalEditar(ordem, e)}
            className="rounded bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-700"
          >
            Editar
          </button>
          {ordem.status_os !== "Concluída" && (
            <button
              onClick={(e) => excluirOrdem(ordem, e)}
              className="rounded bg-red-900/40 px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-900/70"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-xl shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-wide text-red-500">
            Operações
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Ordens de serviço
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Gerencie as ordens de serviço da oficina.
              </p>
            </div>
            <div className="flex items-end gap-4">
              <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                <p className="text-xs text-gray-400">Total de ordens</p>
                <p className="text-2xl font-bold text-red-500">
                  {ordens.length}
                </p>
              </div>
              <button
                onClick={abrirModalNovo}
                className="rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                + Nova OS
              </button>
            </div>
          </div>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-yellow-400">
                Aberta ({abertas.length})
              </h2>
            </div>
            {abertas.length === 0 && (
              <p className="text-sm text-gray-600">Nenhuma ordem aberta.</p>
            )}
            {abertas.map((ordem) => (
              <CardOrdem key={ordem.id_os} ordem={ordem} />
            ))}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-blue-400">
                Em andamento ({andamento.length})
              </h2>
            </div>
            {andamento.length === 0 && (
              <p className="text-sm text-gray-600">Nenhuma em andamento.</p>
            )}
            {andamento.map((ordem) => (
              <CardOrdem key={ordem.id_os} ordem={ordem} />
            ))}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-green-400">
                Concluída ({concluidas.length})
              </h2>
            </div>
            {concluidas.length === 0 && (
              <p className="text-sm text-gray-600">Nenhuma concluída.</p>
            )}
            {concluidas.map((ordem) => (
              <CardOrdem key={ordem.id_os} ordem={ordem} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal cadastro / edição */}
      {modalCadastroAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <h2 className="text-2xl font-bold text-white">
              {ordemEditando ? "Editar OS" : "Nova OS"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {ordemEditando
                ? "Atualize os dados da ordem."
                : "Crie uma nova ordem de serviço."}
            </p>
            <div className="mt-5 space-y-3">
              {!ordemEditando && (
                <select
                  value={formOrdem.cliente_id}
                  onChange={(e) => {
                    const id = e.target.value;
                    setFormOrdem({
                      ...formOrdem,
                      cliente_id: id,
                      veiculo_id: "",
                    });
                    buscarVeiculosDoCliente(id);
                  }}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              )}
              {buscandoVeiculos && (
                <p className="text-sm text-gray-400">Buscando veículos...</p>
              )}
              {!ordemEditando &&
                formOrdem.cliente_id &&
                !buscandoVeiculos &&
                veiculosDoCliente.length === 0 && (
                  <p className="text-sm text-yellow-500">
                    Este cliente não tem veículos cadastrados.
                  </p>
                )}
              {((!ordemEditando && veiculosDoCliente.length > 0) ||
                ordemEditando) && (
                <select
                  value={formOrdem.veiculo_id}
                  onChange={(e) =>
                    setFormOrdem({ ...formOrdem, veiculo_id: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
                >
                  <option value="">Selecione um veículo</option>
                  {ordemEditando
                    ? [
                        {
                          id_veiculo: formOrdem.veiculo_id,
                          modelo: "Veículo atual",
                        },
                      ].map((v) => (
                        <option key={v.id_veiculo} value={v.id_veiculo}>
                          {v.modelo}
                        </option>
                      ))
                    : veiculosDoCliente.map((v) => (
                        <option key={v.id_veiculo} value={v.id_veiculo}>
                          {v.modelo} — {v.placa}
                        </option>
                      ))}
                </select>
              )}
              <textarea
                placeholder="Descrição do serviço"
                value={formOrdem.descricao}
                onChange={(e) =>
                  setFormOrdem({ ...formOrdem, descricao: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800 resize-none"
              />
              <select
                value={formOrdem.status_os}
                onChange={(e) =>
                  setFormOrdem({ ...formOrdem, status_os: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              >
                <option value="Aberta">Aberta</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
              </select>
              <input
                placeholder="Valor total (ex: 310.00)"
                value={formOrdem.valor_total}
                onChange={(e) =>
                  setFormOrdem({ ...formOrdem, valor_total: e.target.value })
                }
                className="w-full rounded-lg border border-gray-800 bg-gray-950 p-3 text-white outline-none focus:border-red-800"
              />
              <input
                type="date"
                value={formOrdem.data_abertura}
                onChange={(e) =>
                  setFormOrdem({ ...formOrdem, data_abertura: e.target.value })
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
                onClick={salvarOrdem}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                {ordemEditando ? "Salvar alterações" : "Criar OS"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalhe da OS */}
      {modalDetalheAberto && detalheOrdem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-red-500">
                  Ordem de serviço
                </p>
                <h2 className="mt-1 text-3xl font-bold text-white">
                  OS #{detalheOrdem.ordem?.id_os}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={gerarPDF}
                  disabled={gerandoPDF}
                  className="rounded bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {gerandoPDF ? "Gerando..." : "📄 Gerar PDF"}
                </button>
                <button
                  onClick={fecharDetalhe}
                  className="rounded bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div
              ref={pdfRef}
              style={{
                backgroundColor: "#0a0a0f",
                color: "#f0f0f0",
                padding: "32px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  borderBottom: "2px solid #991b1b",
                  paddingBottom: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#ef4444",
                      margin: 0,
                      letterSpacing: "0.05em",
                    }}
                  >
                    OFICINA MECÂNICA
                  </h1>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      margin: "4px 0 0",
                    }}
                  >
                    Ordem de Serviço #{detalheOrdem.ordem?.id_os}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Data
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#d1d5db",
                      margin: "2px 0 0",
                    }}
                  >
                    {detalheOrdem.ordem?.data_abertura?.slice(0, 10)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    background: "#1c1c10",
                    border: "1px solid #854d0e",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#fbbf24",
                  }}
                >
                  {detalheOrdem.ordem?.status_os}
                </div>
              </div>

              {/* Descrição */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                }}
              >
                {detalheOrdem.ordem?.descricao}
              </p>

              {/* Cliente e veículo */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background: "#111118",
                    border: "1px solid #1f1f2e",
                    borderRadius: "6px",
                    padding: "14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: "0 0 6px",
                    }}
                  >
                    Cliente
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#f0f0f0",
                      margin: "0 0 2px",
                    }}
                  >
                    {detalheOrdem.cliente?.nome}
                  </p>
                  <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
                    {detalheOrdem.cliente?.telefone}
                  </p>
                </div>
                <div
                  style={{
                    background: "#111118",
                    border: "1px solid #1f1f2e",
                    borderRadius: "6px",
                    padding: "14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: "0 0 6px",
                    }}
                  >
                    Veículo
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#f0f0f0",
                      margin: "0 0 2px",
                    }}
                  >
                    {detalheOrdem.veiculo?.modelo} · {detalheOrdem.veiculo?.ano}
                  </p>
                  <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
                    {detalheOrdem.veiculo?.placa}
                  </p>
                </div>
              </div>

              {/* Peças */}
              {detalheOrdem.pecas?.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#6b7280",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    Peças
                  </p>
                  {detalheOrdem.pecas.map((peca, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        borderBottom: "1px solid #1f1f2e",
                        padding: "8px 0",
                        color: "#d1d5db",
                      }}
                    >
                      <span>
                        {peca.nome}{" "}
                        <span style={{ color: "#6b7280" }}>
                          ×{peca.quantidade}
                        </span>
                      </span>
                      <span>R$ {Number(peca.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Serviços */}
              {detalheOrdem.servicos?.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#6b7280",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    Serviços
                  </p>
                  {detalheOrdem.servicos.map((servico, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        borderBottom: "1px solid #1f1f2e",
                        padding: "8px 0",
                        color: "#d1d5db",
                      }}
                    >
                      <span>{servico.descricao}</span>
                      <span>R$ {Number(servico.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px solid #991b1b",
                  paddingTop: "16px",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  Total
                </span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ef4444",
                  }}
                >
                  R$ {Number(detalheOrdem.ordem?.valor_total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ordens;
