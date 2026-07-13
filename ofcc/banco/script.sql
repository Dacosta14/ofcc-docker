

CREATE DATABASE IF NOT EXISTS oficina; USE oficina;

-- =========================
-- CLIENTES
-- =========================

CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

-- =========================
-- VEICULOS
-- =========================

CREATE TABLE veiculos (
    id_veiculo INT PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(10) NOT NULL,
    ano INT NOT NULL,

    cliente_id INT NOT NULL,

    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id_cliente)
);

-- =========================
-- ORDENS DE SERVIÇO
-- =========================

CREATE TABLE ordens_servico (
    id_os INT PRIMARY KEY AUTO_INCREMENT,

    data_abertura DATETIME NOT NULL,

    status_os VARCHAR(30) NOT NULL,

    descricao TEXT NOT NULL,

    valor_total DECIMAL(10,2) NOT NULL,

    veiculo_id INT NOT NULL,

    FOREIGN KEY (veiculo_id)
    REFERENCES veiculos(id_veiculo)
);

-- =========================
-- PEÇAS
-- =========================

CREATE TABLE pecas (
    id_peca INT PRIMARY KEY AUTO_INCREMENT,

    nome VARCHAR(100) NOT NULL,

    valor DECIMAL(10,2) NOT NULL,

    loja VARCHAR(100)
);

-- =========================
-- SERVIÇOS
-- =========================

CREATE TABLE servicos (
    id_servico INT PRIMARY KEY AUTO_INCREMENT,

    descricao TEXT NOT NULL,

    valor DECIMAL(10,2) NOT NULL
);

-- =========================
-- OS_PEÇAS
-- =========================

CREATE TABLE os_pecas (
    id_os_peca INT PRIMARY KEY AUTO_INCREMENT,

    os_id INT NOT NULL,

    peca_id INT NOT NULL,

    quantidade INT NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (os_id)
    REFERENCES ordens_servico(id_os),

    FOREIGN KEY (peca_id)
    REFERENCES pecas(id_peca)
);

-- =========================
-- OS_SERVICOS
-- =========================

CREATE TABLE os_servicos (
    id_os_servico INT PRIMARY KEY AUTO_INCREMENT,

    os_id INT NOT NULL,

    servico_id INT NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (os_id)
    REFERENCES ordens_servico(id_os),

    FOREIGN KEY (servico_id)
    REFERENCES servicos(id_servico)
);


