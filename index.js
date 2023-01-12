//CONSTANTES
const minimoQuadrantes = 1;
const qtdQuadrantes = 15;
const controleCima = 'ArrowUp';
const controleBaixo = 'ArrowDown';
const controleEsquerda = 'ArrowLeft';
const controleDireita = 'ArrowRight';
const listaComandoControle = [controleCima, controleBaixo, controleEsquerda, controleDireita];
const cobrinha = montarCobrinha(3);
const maca = {
    linha: 0,
    coluna: 0
};

//VARIÁVEIS GLOBAIS
var intervaloMovimentoCobrinha;
var ultimoComandoAcionado;
var jogoIniciado = false;
var fimDeJogo = false;

//INTERFACE
function desenharTabuleiro() {
    document.getElementById('tabuleiro').innerHTML = "";
    for (let i = 1; i <= qtdQuadrantes; i++) {
        let novaLinha = document.createElement('tr');
        document.getElementById('tabuleiro').appendChild(novaLinha);

        for (let j = 1; j <= qtdQuadrantes; j++) {
            let novaColuna = document.createElement('td');
            novaColuna.setAttribute('id', `quadrante-${i}-${j}`);
            novaColuna.classList.add('quadrante-tabuleiro');
            novaLinha.appendChild(novaColuna);
        }
    }

    for (let i = 0; i <= cobrinha.length - 1; i++) {
        const parteCorpoCobrinha = cobrinha[i];
        const idElemento = `quadrante-${parteCorpoCobrinha.linha}-${parteCorpoCobrinha.coluna}`;
        document.getElementById(idElemento).classList.add('quadrante-azul');
    }

    document.getElementById(`quadrante-${maca.linha}-${maca.coluna}`).classList.add('quadrante-laranja');
}

//CONSTRUÇÃO COBRINHA
function montarCobrinha(qtdPartesCorpo) {
    let cobrinhaCompleta = [];
    for (let i = qtdPartesCorpo; i >= 1; i--) {
        cobrinhaCompleta.push(montarParteCorpoCobrinha(5, i));
    }

    return cobrinhaCompleta;
}

function montarParteCorpoCobrinha(posLinha, posColuna) {
    return {
        linha: posLinha,
        coluna: posColuna,
        posicaoAnterior: {
            linha: 0,
            coluna: 0
        }
    };
}

//COMANDOS
document.addEventListener('keydown', eventoMovimentarCobrinha);

function eventoMovimentarCobrinha(event) {
    const comandoAcionado = listaComandoControle
        .find(teclaPressionada => teclaPressionada === event.key && teclaPressionada !== ultimoComandoAcionado);

    if (!jogoIniciado && comandoAcionado === controleEsquerda) {
        return;
    }

    jogoIniciado = true;

    if (!movimentoEhValido(comandoAcionado) || !!fimDeJogo) {
        return;
    }
    
    if (!!comandoAcionado) {
        if (!!intervaloMovimentoCobrinha) {
            clearInterval(intervaloMovimentoCobrinha);
        }

        ultimoComandoAcionado = comandoAcionado;
        acionarMovimentoCobrinha(comandoAcionado);
        intervaloMovimentoCobrinha = setInterval(() => {
            acionarMovimentoCobrinha(comandoAcionado);
        }, 150);
    }
}

function acionarMovimentoCobrinha(comandoControle) {
    if (cobrinhaMorreu(comandoControle)) {
        acabarJogo();
        return;
    }
    
    movimentarCobrinha(comandoControle);

    const cabecaCobrinha = cobrinha[0];
    if (macaOcupaPosicao(cabecaCobrinha.linha, cabecaCobrinha.coluna)) {
        comerMaca();
    }

    desenharTabuleiro();
}

//REGRAS JOGO
function acabarJogo() {
    clearInterval(intervaloMovimentoCobrinha);
    fimDeJogo = true;
    document.getElementById(`quadrante-${cobrinha[0].linha}-${cobrinha[0].coluna}`).classList.add('quadrante-vermelho');
    document.getElementById('mensagem-jogador').innerHTML = '<h1>Você morreu!</h1><br><input type="button" value="Jogar novamente" onClick="document.location.reload(true)">';
}

function cobrinhaMorreu(comandoControleValidar) {
    if (colisaoParede(comandoControleValidar)) {
        return true;
    }

    if (colisaoProprioCorpo(comandoControleValidar)) {
        return true;
    }

    return false;
}

function colisaoParede(comandoControleValidar) {
    if (comandoControleValidar === controleCima && cobrinha[0].linha === minimoQuadrantes) {
        return true;
    }

    if (comandoControleValidar === controleBaixo && cobrinha[0].linha === qtdQuadrantes) {
        return true;
    }

    if (comandoControleValidar === controleDireita && cobrinha[0].coluna === qtdQuadrantes) {
        return true;
    }

    if (comandoControleValidar === controleEsquerda && cobrinha[0].coluna === minimoQuadrantes) {
        return true;
    }

    return false;
}

function colisaoProprioCorpo(comandoControleValidar) {
    if (comandoControleValidar === controleCima) {
        const proximaPosicao = {
            linha: cobrinha[0].linha - 1,
            coluna: cobrinha[0].coluna
        };

        if (cobrinhaOcupaPosicao(proximaPosicao.linha, proximaPosicao.coluna)) {
            return true;
        }
    }

    if (comandoControleValidar === controleBaixo) {
        const proximaPosicao = {
            linha: cobrinha[0].linha + 1,
            coluna: cobrinha[0].coluna
        };

        if (cobrinhaOcupaPosicao(proximaPosicao.linha, proximaPosicao.coluna)) {
            return true;
        }
    }

    if (comandoControleValidar === controleDireita) {
        const proximaPosicao = {
            linha: cobrinha[0].linha,
            coluna: cobrinha[0].coluna + 1
        };

        if (cobrinhaOcupaPosicao(proximaPosicao.linha, proximaPosicao.coluna)) {
            return true;
        }
    }

    if (comandoControleValidar === controleEsquerda) {
        const proximaPosicao = {
            linha: cobrinha[0].linha,
            coluna: cobrinha[0].coluna - 1
        };

        if (cobrinhaOcupaPosicao(proximaPosicao.linha, proximaPosicao.coluna)) {
            return true;
        }
    }
    
    return false;
}

function movimentoEhValido(comandoControleValidar) {
    if (comandoControleValidar === controleCima && ultimoComandoAcionado === controleBaixo) {
        return false;
    }

    if (comandoControleValidar === controleBaixo && ultimoComandoAcionado === controleCima) {
        return false;
    }

    if (comandoControleValidar === controleDireita && ultimoComandoAcionado === controleEsquerda) {
        return false;
    }

    if (comandoControleValidar === controleEsquerda && ultimoComandoAcionado === controleDireita) {
        return false;
    }

    return true;
}

function comerMaca() {
    aumentarCorpoCobrinha();
    posicionarMaca();
}

//MACA
function macaOcupaPosicao(posLinha, posColuna) {
    return maca.linha === posLinha
        && maca.coluna === posColuna;
}

function posicionarMaca() {
    do {
        maca.linha = Math.floor(Math.random() * 15) + 1;
        maca.coluna = Math.floor(Math.random() * 15) + 1;
    } while (cobrinhaOcupaPosicao(maca.linha, maca.coluna));
}

//COBRINHA
function salvarPosicaoAnterior(parteCorpoCobrinha) {
    parteCorpoCobrinha.posicaoAnterior.linha = parteCorpoCobrinha.linha;
    parteCorpoCobrinha.posicaoAnterior.coluna = parteCorpoCobrinha.coluna;
}

function ajustarCorpoCobraAoMovimentoCabeca() {
    for (let i = 1; i <= cobrinha.length - 1; i++) {
        const parteCorpoCobrinha = cobrinha[i];
        const parteAnteriorCobrinha = cobrinha[i - 1];
        salvarPosicaoAnterior(parteCorpoCobrinha);
        parteCorpoCobrinha.coluna = parteAnteriorCobrinha.posicaoAnterior.coluna;
        parteCorpoCobrinha.linha = parteAnteriorCobrinha.posicaoAnterior.linha;
    }
}

function andarEsquerda() {
    const cabecaCobrinha = cobrinha[0];
    salvarPosicaoAnterior(cabecaCobrinha);
    cabecaCobrinha.coluna--;

    ajustarCorpoCobraAoMovimentoCabeca();
}

function andarDireita() {
    const cabecaCobrinha = cobrinha[0];
    salvarPosicaoAnterior(cabecaCobrinha);
    cabecaCobrinha.coluna++;

    ajustarCorpoCobraAoMovimentoCabeca();
}

function andarCima() {
    const cabecaCobrinha = cobrinha[0];
    salvarPosicaoAnterior(cabecaCobrinha);
    cabecaCobrinha.linha--;

    ajustarCorpoCobraAoMovimentoCabeca();
}

function andarBaixo() {
    const cabecaCobrinha = cobrinha[0];
    salvarPosicaoAnterior(cabecaCobrinha);
    cabecaCobrinha.linha++;

    ajustarCorpoCobraAoMovimentoCabeca();
}

function movimentarCobrinha(comandoControle) {
    switch (comandoControle) {
        case controleCima:
            andarCima();
            break;
        case controleBaixo:
            andarBaixo();
            break;
        case controleEsquerda:
            andarEsquerda();
            break;
        case controleDireita:
            andarDireita();
            break;
    }
}

function cobrinhaOcupaPosicao(posLinha, posColuna) {
    return !!cobrinha.find((pedacoCorpoCobrinha) =>
        pedacoCorpoCobrinha.linha === posLinha &&
        pedacoCorpoCobrinha.coluna === posColuna
    );
}

function aumentarCorpoCobrinha() {
    const ultimaParteCobrinha = cobrinha[cobrinha.length - 1];
    cobrinha.push(montarParteCorpoCobrinha(ultimaParteCobrinha.posicaoAnterior.linha, ultimaParteCobrinha.posicaoAnterior.coluna));
}

//INICIADOR
posicionarMaca();
desenharTabuleiro();