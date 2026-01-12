let carrinho=[];

db.collection("produtos")
.where("disponivel","==",true)
.onSnapshot(snap=>{
  lista.innerHTML="";
  snap.forEach(doc=>{
    const p=doc.data();
    lista.innerHTML+=`
      <div class="produto">
        <img src="${p.imagem}">
        <b>${p.nome}</b><br>
        R$ ${p.preco.toFixed(2)}<br>
        <button onclick="add('${p.nome}',${p.preco})">Adicionar</button>
      </div>`;
  });
});

function add(nome,preco){
  carrinho.push({nome,preco});
}

function finalizar(){
  if(!carrinho.length) return alert("Carrinho vazio");
  const nome=prompt("Seu nome:");
  const tel=prompt("Telefone com DDD:");
  if(!nome||!tel) return;

  const total=carrinho.reduce((s,i)=>s+i.preco,0);

  db.collection("pedidos").add({
    nome,telefone:tel,itens:carrinho,total,
    criadoEm:firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Pedido enviado!");
  carrinho=[];
}

function aceitar(){ aviso.style.display="none"; }

function abrirAdmin(){
  const s=prompt("Senha:");
  if(s==="hayama2012"){
    localStorage.setItem("admin","ok");
    location.href="admin.html";
  }
}
