import { useState, useEffect } from "react";

function Home() {
  const [clientes, setClientes] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [pecas, setPecas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/ordens")
      .then((res) => res.json())
      .then((data) => setOrdens(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/pecas")
      .then((res) => res.json())
      .then((data) => setPecas(data));
  }, []);

  const statusClass = {
    Aberta: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    "Em andamento": "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    Finalizada: "bg-green-500/10 text-green-400 ring-green-500/20",
  };

  const ordensAbertas = ordens.filter(
    (ordem) => ordem.status_os === "Aberta",
  ).length;

  const ordensEmAndamento = ordens.filter(
    (ordem) => ordem.status_os === "Em andamento",
  ).length;

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-6 shadow-xl shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-wide text-red-500">
            Painel da oficina
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold text-white">Home</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Visão geral dos clientes, ordens de serviço e peças cadastradas.
              </p>
            </div>

            <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
              <p className="text-xs text-gray-400">Ordens abertas</p>
              <p className="text-2xl font-bold text-red-500">{ordensAbertas}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-red-900/70">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Clientes</p>
              <span className="h-2 w-2 rounded-full bg-red-600" />
            </div>
            <p className="mt-4 text-4xl font-bold text-white">
              {clientes.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">clientes cadastrados</p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-red-900/70">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Ordens</p>
              <span className="h-2 w-2 rounded-full bg-red-600" />
            </div>
            <p className="mt-4 text-4xl font-bold text-white">
              {ordens.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">serviços registrados</p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-red-900/70">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Peças</p>
              <span className="h-2 w-2 rounded-full bg-red-600" />
            </div>
            <p className="mt-4 text-4xl font-bold text-white">{pecas.length}</p>
            <p className="mt-1 text-xs text-gray-500">itens em estoque</p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-black/20 transition hover:border-blue-900/70">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Em andamento</p>
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <p className="mt-4 text-4xl font-bold text-white">
              {ordensEmAndamento}
            </p>
            <p className="mt-1 text-xs text-gray-500">ordens em execução</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-lg border border-gray-800 bg-gray-900/70 p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Últimas ordens</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Acompanhe os serviços mais recentes.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {ordens.map((ordem) => (
                <div
                  key={ordem.id_os}
                  className="rounded-lg border border-gray-800 bg-gray-950/70 p-4 transition hover:border-red-900/70 hover:bg-gray-950"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        OS #{ordem.id_os}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        {ordem.descricao}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        statusClass[ordem.status_os] ||
                        "bg-gray-500/10 text-gray-400 ring-gray-500/20"
                      }`}
                    >
                      {ordem.status_os}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-lg border border-gray-800 bg-gray-900/70 p-5 shadow-xl shadow-black/20">
            <h2 className="text-lg font-bold text-white">Resumo</h2>

            <div className="mt-5 space-y-4">
              <div className="border-l-2 border-yellow-500 pl-4">
                <p className="text-sm text-gray-400">Abertas</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {ordensAbertas}
                </p>
              </div>

              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-sm text-gray-400">Em andamento</p>
                <p className="text-2xl font-bold text-blue-400">
                  {ordensEmAndamento}
                </p>
              </div>

              <div className="border-l-2 border-red-700 pl-4">
                <p className="text-sm text-gray-400">Estoque</p>
                <p className="text-2xl font-bold text-red-500">
                  {pecas.length}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
