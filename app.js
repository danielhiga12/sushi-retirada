let cardapio = JSON.parse(localStorage.getItem('cardapio'))||[];
let retirada = [];
let ultimoPedido = parseInt(localStorage.getItem('ultimoPedido'))||0;
let itensPorPagina = 8; // para paginação
let paginaAtual = 1;

// SALVAR
function salvarCardapio(){ localStorage.setItem('cardapio',JSON.stringify(cardapio)); }
function salvarUltimoPedido(){ localStorage.setItem('ultimoPedido',ultimoPedido); }

// MODAL
function abrirAdicionarProduto(){document.getElementById('modalAdicionarProduto').style.display='block';}
function fecharAdicionarProduto(){document.getElementById('modalAdicionarProduto').style.display='none';}

// ADICIONAR PRODUTO AO CARDÁPIO
function adicionarProdutoCardapio(){
    const nome=document.getElementById('nomeNovoProduto').value.trim();
    const valor=parseFloat(document.getElementById('valorNovoProduto').value);
    if(!nome || valor<=0){alert('Preencha corretamente');return;}
    cardapio.push({nome,valor});
    salvarCardapio(); renderCardapio(); fecharAdicionarProduto();
    document.getElementById('nomeNovoProduto').value=''; document.getElementById('valorNovoProduto').value='';
}

// RENDER CARDÁPIO COM PAGINAÇÃO
function renderCardapio(){
    const container=document.getElementById('cardsContainer'); container.innerHTML='';
    const filtro=document.getElementById('pesquisarCardapio').value.toLowerCase();
    const filtrado=cardapio.filter(p=>p.nome.toLowerCase().includes(filtro));
    const totalPaginas=Math.ceil(filtrado.length/itensPorPagina);
    if(paginaAtual>totalPaginas) paginaAtual=1;
    const inicio=(paginaAtual-1)*itensPorPagina; const fim=inicio+itensPorPagina;
    const paginaItens=filtrado.slice(inicio,fim);
    paginaItens.forEach((p,index)=>{
        const card=document.createElement('div');
        card.className='card';
        card.innerHTML=`<h4>${p.nome}</h4><p>R$ ${p.valor.toFixed(2)}</p><button onclick="adicionarRetirada(${cardapio.indexOf(p)})">+</button>`;
        container.appendChild(card);
    });
    renderPaginacao(totalPaginas);
}

// PAGINAÇÃO
function renderPaginacao(total){
    const div=document.getElementById('paginacao'); div.innerHTML='';
    for(let i=1;i<=total;i++){
        const btn=document.createElement('button'); btn.innerText=i;
        if(i===paginaAtual) btn.style.background='#45a049';
        btn.onclick=()=>{paginaAtual=i; renderCardapio();}
        div.appendChild(btn);
    }
}

// PESQUISA CARDÁPIO
function filtrarCardapio(){ renderCardapio(); }

// RETIRADA
function adicionarRetirada(index){
    const produto=cardapio[index];
    let qt=parseInt(prompt(`Quantidade para ${produto.nome}:`));
    if(isNaN(qt)||qt<=0){alert('Quantidade inválida');return;}
    const existente=retirada.find(p=>p.nome===produto.nome);
    if(existente){existente.quantidade+=qt;} else{retirada.push({nome:produto.nome,valor:produto.valor,quantidade:qt});}
    renderRetirada();
}

function renderRetirada(){
    const tbody=document.querySelector('#tabelaRetirada tbody'); tbody.innerHTML='';
    retirada.forEach((p,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`
        <td>${p.nome}</td>
        <td><input type="number" value="${p.quantidade}" min="1" onchange="alterarQuantidade(${i},this.value)"></td>
        <td>R$ ${p.valor.toFixed(2)}</td>
        <td>R$ ${(p.valor*p.quantidade).toFixed(2)}</td>
        <td><button onclick="removerRetirada(${i})">Excluir</button></td>`;
        tbody.appendChild(tr);
    });
}

// ALTERAR QUANTIDADE
function alterarQuantidade(index,valor){
    valor=parseInt(valor);
    if(isNaN(valor)||valor<=0){ alert('Quantidade inválida'); renderRetirada(); return; }
    retirada[index].quantidade=valor;
    renderRetirada();
}

// REMOVER
function removerRetirada(index){ retirada.splice(index,1); renderRetirada(); }

// PESQUISA RETIRADA
function filtrarRetirada(){
    const filtro=document.getElementById('pesquisarRetirada').value.toLowerCase();
    const tbody=document.querySelector('#tabelaRetirada tbody'); tbody.innerHTML='';
    retirada.forEach((p,i)=>{
        if(p.nome.toLowerCase().includes(filtro)){
            const tr=document.createElement('tr');
            tr.innerHTML=`
            <td>${p.nome}</td>
            <td><input type="number" value="${p.quantidade}" min="1" onchange="alterarQuantidade(${i},this.value)"></td>
            <td>R$ ${p.valor.toFixed(2)}</td>
            <td>R$ ${(p.valor*p.quantidade).toFixed(2)}</td>
            <td><button onclick="removerRetirada(${i})">Excluir</button></td>`;
            tbody.appendChild(tr);
        }
    });
}

// DATA/HORA
function formatarDataHora(){
    const now=new Date(); const dia=String(now.getDate()).padStart(2,'0'); const mes=String(now.getMonth()+1).padStart(2,'0');
    const ano=now.getFullYear(); const hora=String(now.getHours()).padStart(2,'0'); const min=String(now.getMinutes()).padStart(2,'0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

// IMPRIMIR NFC-e
function imprimirNFCE(){
    const cliente=document.getElementById('nomeCliente').value.trim();
    if(!cliente){alert('Informe o nome do cliente'); return;}
    if(retirada.length===0){alert('Nenhum produto adicionado'); return;}
    ultimoPedido++;
    const pedido=String(ultimoPedido).padStart(4,'0');
    const total=retirada.reduce((acc,p)=>acc+p.valor*p.quantidade,0);
    const dataHora=formatarDataHora();
    let nota='RETIRADA\n==============================\n';
    nota+=`Pedido: ${pedido}\nData/Hora: ${dataHora}\nCliente: ${cliente}\n------------------------------\n`;
    nota+='Produtos:\n';
    retirada.forEach(p=>{
        const nome = p.nome.padEnd(12,' ');
        const qt = String(p.quantidade).padStart(2,' ');
        const subtotal = `R$ ${(p.valor*p.quantidade).toFixed(2)}`.padStart(7,' ');
        nota+=`${nome} x${qt} ${subtotal}\n`;
    });
    nota+='------------------------------\n';
    nota+=`Total: R$ ${total.toFixed(2)}\n------------------------------\n`;
    nota+='Obrigado pela preferência!\n==============================\n';
    for(let i=0;i<2;i++){
        const janela=window.open('','PRINT','height=400,width=600');
        janela.document.write('<pre style="font-family:monospace;font-size:14px;">'+nota+'</pre>');
        janela.document.close(); janela.print();
    }
    retirada=[]; renderRetirada(); document.getElementById('nomeCliente').value='';
    salvarUltimoPedido(); renderCardapio();
}

renderCardapio(); renderRetirada();
