if(localStorage.getItem("admin")!=="ok"){
  location.href="index.html";
}

async function salvar(){
  const file = uploadcare.Widget('[role=uploadcare-uploader]').value();
  if(!file) return alert("Selecione uma imagem!");

  const info = await file.promise();
  const url = info.cdnUrl;

  await db.collection("produtos").add({
    nome: nome.value,
    preco: +preco.value,
    imagem: url,
    disponivel: disp.value === "true"
  });

  alert("Produto salvo!");
}

db.collection("pedidos").onSnapshot(snap=>{
  pedidos.innerHTML="";
  snap.forEach(doc=>{
    const p = doc.data();
    pedidos.innerHTML += `
      <div onclick='imprimir(${JSON.stringify(p)})'>
        ${p.nome} - R$ ${p.total.toFixed(2)}
      </div>
    `;
  });
});

function imprimir(p){
  let html=`
  <div id="recibo">
    <center><b style="font-size:24px">RETIRADA</b></center><br>
    Nome: ${p.nome}<br>
    Telefone: ${p.telefone}<br><br>
  `;
  p.itens.forEach(i=>{
    html += `1 ${i.nome} ${i.preco.toFixed(2)}<br>`;
  });
  html += `
    <br>TOTAL: ${p.total.toFixed(2)}<br><br>
    Obrigado pela preferência
  </div>`;
  document.body.innerHTML = html;
  window.print();
}
