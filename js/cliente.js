let carrinho = [];
let total = 0;
let avisoScroll = false;

async function carregarProdutos(){
  const { data } = await supabase
    .from("produtos")
    .select("*")
    .eq("disponivel", true);

  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  data.forEach(p=>{
    lista.innerHTML += `
      <div class="produto">
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <p>R$ ${p.preco.toFixed(2)}</p>
        <button onclick="addCarrinho('${p.id}', '${p.nome}', ${p.preco})">
          Adicionar
        </button>
      </div>
    `;
  });
}

function addCarrinho(id, nome, preco){
  carrinho.push({ id, nome, preco });
  total += preco;
  document.getElementById("total").innerText = total.toFixed(2);
}

async function finalizar(){
  const nome = prompt("Nome:");
  const telefone = prompt("Telefone com DDD:");

  await supabase.from("pedidos").insert([{
    nome_cliente: nome,
    telefone,
    itens: carrinho,
    total
  }]);

  alert("Pedido enviado!");
  carrinho = [];
  total = 0;
  document.getElementById("total").innerText = "0.00";
}

function abrirAdmin(){
  const senha = prompt("Senha do admin:");
  if(senha === "hayama2012"){
    localStorage.setItem("admin", "ok");
    window.location.href = "admin.html";
  } else {
    alert("Senha incorreta");
  }
}

function verificarAviso(){
  const box = document.getElementById("avisoTexto");
  if (box.scrollTop + box.clientHeight >= box.scrollHeight - 5) {
    avisoScroll = true;
  }
  if (avisoScroll && document.getElementById("checkAviso").checked) {
    document.getElementById("btnAviso").disabled = false;
  }
}

function aceitarAviso(){
  localStorage.setItem("aviso", "ok");
  document.getElementById("avisoFundo").style.display = "none";
}

if (localStorage.getItem("aviso") === "ok") {
  document.getElementById("avisoFundo").style.display = "none";
}

carregarProdutos();
