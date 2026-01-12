// PROTEÇÃO DO ADMIN
if(localStorage.getItem("admin") !== "ok"){
  alert("Acesso restrito");
  window.location.href = "index.html";
}

function sairAdmin(){
  localStorage.removeItem("admin");
  window.location.href = "index.html";
}

async function cadastrar(){
  const nome = document.getElementById("nome").value;
  const preco = Number(document.getElementById("preco").value);
  const file = document.getElementById("imagem").files[0];
  const disponivel = document.getElementById("disp").value === "true";

  const fileName = Date.now() + "-" + file.name;
  await supabase.storage.from("produtos").upload(fileName, file);

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(fileName);

  await supabase.from("produtos").insert([{
    nome,
    preco,
    imagem: data.publicUrl,
    disponivel
  }]);

  alert("Produto cadastrado!");
}

async function carregarPedidos(){
  const { data } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  data.forEach(p=>{
    lista.innerHTML += `
      <div class="pedido">
        <b>${p.nome_cliente}</b><br>
        ${p.telefone}<br>
        Total: R$ ${p.total.toFixed(2)}
        <button onclick="window.print()">Imprimir</button>
      </div>
    `;
  });
}

carregarPedidos();
