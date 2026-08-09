// URL do backend publicado no Cloud Run (Parte 7)
const API_BASE_URL = "https://cadastro-produtos-backend-96532140098.southamerica-east1.run.app";

const form = document.getElementById("form-produto");
const mensagem = document.getElementById("mensagem");
const corpoTabela = document.getElementById("corpo-tabela");

async function carregarProdutos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.id) params.append("id", filtros.id);
  if (filtros.descricao) params.append("descricao", filtros.descricao);
  if (filtros.fabricante) params.append("fabricante", filtros.fabricante);

  const resposta = await fetch(`${API_BASE_URL}/produtos?${params.toString()}`);
  const produtos = await resposta.json();

  corpoTabela.innerHTML = "";
  produtos.forEach((p) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${p.imagem_url ? `<img src="${p.imagem_url}" alt="${p.descricao}" width="60">` : "—"}</td>
      <td>${p.id}</td>
      <td>${p.codigo}</td>
      <td>${p.descricao}</td>
      <td>${p.descricao_sucinta || ""}</td>
      <td>${p.fabricante || ""}</td>
      <td>${p.unidade_medida || ""}</td>
    `;
    corpoTabela.appendChild(linha);
  });
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "Enviando...";

  const dados = new FormData();
  dados.append("codigo", document.getElementById("codigo").value);
  dados.append("descricao", document.getElementById("descricao").value);
  dados.append("descricao_sucinta", document.getElementById("descricao_sucinta").value);
  dados.append("fabricante", document.getElementById("fabricante").value);
  dados.append("unidade_medida", document.getElementById("unidade_medida").value);
  const arquivoImagem = document.getElementById("imagem").files[0];
  if (arquivoImagem) dados.append("imagem", arquivoImagem);

  try {
    const resposta = await fetch(`${API_BASE_URL}/produtos`, { method: "POST", body: dados });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.detail || "Erro ao cadastrar.");
    }
    mensagem.textContent = "Produto cadastrado com sucesso!";
    form.reset();
    carregarProdutos();
  } catch (erro) {
    mensagem.textContent = "Erro: " + erro.message;
  }
});

document.getElementById("btn-filtrar").addEventListener("click", () => {
  carregarProdutos({
    id: document.getElementById("filtro-id").value,
    descricao: document.getElementById("filtro-descricao").value,
    fabricante: document.getElementById("filtro-fabricante").value,
  });
});

document.getElementById("btn-limpar").addEventListener("click", () => {
  document.getElementById("filtro-id").value = "";
  document.getElementById("filtro-descricao").value = "";
  document.getElementById("filtro-fabricante").value = "";
  carregarProdutos();
});

carregarProdutos();