// CARDÁPIO
let cardapio = JSON.parse(localStorage.getItem('cardapio')) || [];
let retirada = [];
let ultimoPedido = parseInt(localStorage.getItem('ultimoPedido')) || 0;

// SALVAR
function salvarCardapio(){ localStorage.setItem('cardapio', JSON.stringify(cardapio)); }
function salvarUltimoPedido(){ localStorage.setItem('ultimoPedido', ultimoPedido); }

// MODAL ADICIONAR PRODUTO
function abrirAdicionarProduto(){ document.getElementById('adicionarProdutoCardapio').style.display='block'; }
function fecharAdicionarProduto(){ document.getElementById('adicionarProdutoCardapio').style.display='none'; }

// ADICIONAR PRODUTO AO CARDÁPIO
function adicionarProdutoCardapio(){
    const nome = document.getElementById('nomeNovoProduto').value.trim();
    const valor = parseFloat(document.getElementById('valorNovoProduto').value);
    if(!nome || valor<=0){ alert('Preencha corretamente.'); return; }
    cardapio.push({nome, valor});
    salvarCardapio(); atualizarCardapio();
    document.getElementById('nomeNovoProduto').value=''; document.getElementById('valorNovoProduto').value=''; fecharAdicionarProduto();
}

// ATUALIZAR TABELA CARDÁPIO
function atualizarCardapio(){
    const tbody = document.querySelector('#tabelaCardapio tbody'); tbody.innerHTML='';
    cardapio.forEach((p,index)=>{
        const tr = document.createElement('tr');
        tr.innerHTML=`<td>${p.nome}</td><td>R$ ${p.valor.toFixed(2)}</td><td><button onclick="adicionarRetirada(${index})">Adicionar à Retirada</button></td>`;
        tbody.appendChild(tr);
    });
}
atualizarCardapio();

// PESQUISA CARDÁPIO
function pesquisarCardapio(){
    const filtro = document.getElementById('pesquisarCardapio').value.toLowerCase();
    const tbody = document.querySelector('#tabelaCardapio tbody'); tbody.innerHTML='';
    cardapio.forEach((p,index)=>{
        if(p.nome.toLowerCase().includes(filtro)){
            const tr = document.createElement('tr');
            tr.innerHTML=`<td>${p.nome}</td><td>R$ ${p.valor.toFixed(2)}</td><td><button onclick="adicionarRetirada(${index})">Adicionar à Retirada</button></td>`;
            tbody.appendChild(tr);
        }
    });
}

// RETIRADA
function adicionarRetirada(index){
    const produto = cardapio[index];
    let qt = parseInt(prompt(`Quantidade para ${produto.nome}:`));
    if(isNaN(qt) || qt<=0){ alert('Quantidade inválida'); return; }
    retirada.push({nome:produto.nome, valor:produto.valor, quantidade:qt});
    atualizarRetirada();
}

function atualizarRetirada(){
    const tbody = document.querySelector('#tabelaRetirada tbody'); tbody.innerHTML='';
    retirada.forEach((p,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${p.nome}</td><td>${p.quantidade}</td><td>R$ ${p.valor.toFixed(2)}</td><td>R$ ${(p.valor*p.quantidade).toFixed(2)}</td><td><button onclick="removerRetirada(${i})">Remover</button></td>`;
        tbody.appendChild(tr);
    });
}

function removerRetirada(index){ retirada.splice(index,1); atualizarRetirada(); }

// PESQUISA RETIRADA (apenas filtra tabela)
function pesquisarRetirada(){
    const filtro = document.getElementById('pesquisarRetirada').value.toLowerCase();
    const tbody = document.querySelector('#tabelaRetirada tbody'); tbody.innerHTML='';
    retirada.forEach((p,i)=>{
        if(p.nome.toLowerCase().includes(filtro)){
            const tr=document.createElement('tr');
            tr.innerHTML=`<td>${p.nome}</td><td>${p.quantidade}</td><td>R$ ${p.valor.toFixed(2)}</td><td>R$ ${(p.valor*p.quantidade).toFixed(2)}</td><td><button onclick="removerRetirada(${i})">Remover</button></td>`;
            tbody.appendChild(tr);
        }
    });
}

// DATA/HORA
function formatarDataHora(){
    const now = new Date();
    const dia=String(now.getDate()).padStart(2,'0');
    const mes=String(now.getMonth()+1).padStart(2,'0');
    const ano=now.getFullYear();
    const hora=String(now.getHours()).padStart(2,'0');
    const min=String(now.getMinutes()).padStart(2,'0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

// IMPRIMIR NFC-e
function imprimirNFCE(){
    const cliente = document.getElementById('nomeCliente').value.trim();
    if(!cliente){ alert('Informe o nome do cliente'); return; }
    if(retirada.length===0){ alert('Nenhum produto adicionado'); return; }

    ultimoPedido++;
    const pedido = String(ultimoPedido).padStart(4,'0');
    const total = retirada.reduce((acc,p)=>acc+p.valor*p.quantidade,0);
    const dataHora = formatarDataHora();

    let nota = 'RETIRADA\n==============================\n';
    nota += `Pedido: ${pedido}\nData/Hora: ${dataHora}\nCliente: ${cliente}\n------------------------------\n`;
    nota += 'Produtos:\n';
    retirada.forEach(p=>{ nota += `${p.nome} x${p.quantidade} - R$ ${(p.valor*p.quantidade).toFixed(2)}\n`; });
    nota += '------------------------------\n';
    nota += `Total: R$ ${total.toFixed(2)}\n------------------------------\n`;
    nota += 'Obrigado pela preferência!\n==============================\n';

    for(let i=0;i<2;i++){
        const janela=window.open('','PRINT','height=400,width=600');
        janela.document.write('<pre style="font-family:monospace; font-size:14px;">'+nota+'</pre>');
        janela.document.close();
        janela.print();
    }

    retirada=[]; atualizarRetirada(); document.getElementById('nomeCliente').value='';
    salvarUltimoPedido();
}
