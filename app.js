let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let ultimoPedido = parseInt(localStorage.getItem('ultimoPedido')) || 0;

function salvarLocalStorage() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('ultimoPedido', ultimoPedido);
}

function atualizarTabela() {
    const tbody = document.querySelector('#tabelaProdutos tbody');
    tbody.innerHTML = '';
    produtos.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>R$ ${p.valor.toFixed(2)}</td>
            <td>R$ ${(p.quantidade * p.valor).toFixed(2)}</td>
            <td><button onclick="removerProduto(${index})">Remover</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function adicionarProduto() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeProduto').value);
    const valor = parseFloat(document.getElementById('valorProduto').value);

    if (!nome || quantidade <= 0 || valor <= 0) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    produtos.push({ nome, quantidade, valor });
    salvarLocalStorage();
    atualizarTabela();

    document.getElementById('nomeProduto').value = '';
    document.getElementById('quantidadeProduto').value = '';
    document.getElementById('valorProduto').value = '';
}

function removerProduto(index) {
    produtos.splice(index, 1);
    salvarLocalStorage();
    atualizarTabela();
}

function formatarDataHora() {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const ano = now.getFullYear();
    const hora = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function finalizarPedido() {
    const nomeCliente = document.getElementById('nomeCliente').value.trim();
    if (!nomeCliente) {
        alert('Informe o nome do cliente.');
        return;
    }
    if (produtos.length === 0) {
        alert('Adicione pelo menos um produto.');
        return;
    }

    ultimoPedido++;
    const numeroPedido = String(ultimoPedido).padStart(4, '0');
    const total = produtos.reduce((acc, p) => acc + (p.valor * p.quantidade), 0);
    const dataHora = formatarDataHora();

    // Recibo TM-T20
    let notaFiscal = '';
    notaFiscal += 'RETIRADA\n';
    notaFiscal += '==============================\n';
    notaFiscal += `Pedido: ${numeroPedido}\n`;
    notaFiscal += `Data/Hora: ${dataHora}\n`;
    notaFiscal += `Cliente: ${nomeCliente}\n`;
    notaFiscal += '------------------------------\n';
    notaFiscal += 'Produtos:\n';
    produtos.forEach(p => {
        let linha = `${p.nome} x${p.quantidade} - R$ ${(p.valor * p.quantidade).toFixed(2)}\n`;
        notaFiscal += linha;
    });
    notaFiscal += '------------------------------\n';
    notaFiscal += `Total: R$ ${total.toFixed(2)}\n`;
    notaFiscal += '------------------------------\n';
    notaFiscal += 'Obrigado pela preferência!\n';
    notaFiscal += '==============================\n';

    // Imprimir 2 vezes
    for (let i = 0; i < 2; i++) {
        const janela = window.open('', 'PRINT', 'height=400,width=600');
        janela.document.write('<pre style="font-family:monospace; font-size:14px;">' + notaFiscal + '</pre>');
        janela.document.close();
        janela.print();
    }

    produtos = [];
    salvarLocalStorage();
    atualizarTabela();
    document.getElementById('nomeCliente').value = '';
}

// Inicializa tabela
atualizarTabela();
