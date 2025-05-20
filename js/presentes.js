document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado. A executar presentes.js");

    const trilhaCarrossel = document.querySelector('.carrosselTrilha');
    const botaoProximo = document.getElementById('botaoCarrosselProximo');
    const botaoAnterior = document.getElementById('botaoCarrosselAnterior');
    const janelaCarrossel = document.querySelector('.carrosselJanela');

    let idDoPresenteNoModalAtual = null; // Variável para guardar o ID do presente no modal

    if (trilhaCarrossel) {
        const cartoesPresenteCarrossel = Array.from(trilhaCarrossel.children);
        if (cartoesPresenteCarrossel.length > 0 && botaoProximo && botaoAnterior && janelaCarrossel) {
            let larguraCartao = cartoesPresenteCarrossel[0].getBoundingClientRect().width;
            let gapCarrossel = parseFloat(getComputedStyle(trilhaCarrossel).gap) || 20;
            let indiceAtual = 0;
            let cartoesVisiveis = Math.max(1, Math.floor(janelaCarrossel.offsetWidth / (larguraCartao + gapCarrossel)));

            const moverParaCartao = (indiceAlvo) => {
                if (!trilhaCarrossel) return;
                const novoIndice = Math.max(0, Math.min(indiceAlvo, cartoesPresenteCarrossel.length - cartoesVisiveis));
                const deslocamento = novoIndice * (larguraCartao + gapCarrossel);
                trilhaCarrossel.style.transform = `translateX(-${deslocamento}px)`;
                indiceAtual = novoIndice;
                atualizarBotoesCarrossel();
            };

            const atualizarBotoesCarrossel = () => {
                if (!botaoAnterior || !botaoProximo) return;
                botaoAnterior.style.display = indiceAtual === 0 ? 'none' : 'flex';
                const ultimoIndicePossivel = Math.max(0, cartoesPresenteCarrossel.length - cartoesVisiveis);
                botaoProximo.style.display = indiceAtual >= ultimoIndicePossivel ? 'none' : 'flex';
            };

            botaoProximo.addEventListener('click', () => moverParaCartao(indiceAtual + 1));
            botaoAnterior.addEventListener('click', () => moverParaCartao(indiceAtual - 1));

            window.addEventListener('resize', () => {
                if (cartoesPresenteCarrossel.length > 0 && janelaCarrossel && trilhaCarrossel) {
                    larguraCartao = cartoesPresenteCarrossel[0].getBoundingClientRect().width;
                    gapCarrossel = parseFloat(getComputedStyle(trilhaCarrossel).gap) || 20;
                    cartoesVisiveis = Math.max(1, Math.floor(janelaCarrossel.offsetWidth / (larguraCartao + gapCarrossel)));
                    moverParaCartao(indiceAtual);
                    atualizarBotoesCarrossel();
                }
            });
            moverParaCartao(0);
            atualizarBotoesCarrossel();
        }
    }

    const modalPresente = document.getElementById('modalPresente');
    const botaoFecharModal = document.querySelector('.botaoFecharModal');
    const botoesVerDetalhes = document.querySelectorAll('.botaoVerDetalhesPresente');
    const modalImagemPresente = document.getElementById('modalImagemPresente');
    const modalTituloPresente = document.getElementById('modalTituloPresente');
    const modalDescricaoPresente = document.getElementById('modalDescricaoPresente');

    const miniFormulario = document.getElementById('miniFormularioPresente');
    const inputIdeiaPresente = document.getElementById('ideiaPresente');
    const inputDataPresente = document.getElementById('dataPresente');
    const inputObservacaoPresente = document.getElementById('observacaoPresente');
    const botaoSubmeterIdeia = document.getElementById('botaoSubmeterIdeia');
    const botaoAcaoModalPrincipal = document.getElementById('botaoAcaoModalPrincipal');

    let tituloOriginalDoPresenteSelecionado = "";

    if (modalPresente && botaoFecharModal && botoesVerDetalhes.length > 0 && modalImagemPresente && modalTituloPresente && modalDescricaoPresente && miniFormulario && botaoAcaoModalPrincipal && botaoSubmeterIdeia) {

        const abrirModal = (cartao) => {
            const presenteId = cartao.dataset.presenteId; // Captura o ID do presente
            idDoPresenteNoModalAtual = presenteId; // Armazena o ID para uso posterior

            tituloOriginalDoPresenteSelecionado = cartao.dataset.presenteTitulo || "Presente";
            const descricao = cartao.dataset.presenteDescricao;
            const imagemSrc = cartao.dataset.presenteImagemReal || cartao.querySelector('.cartaoPresenteImagem').src;

            modalTituloPresente.textContent = tituloOriginalDoPresenteSelecionado;
            modalDescricaoPresente.textContent = descricao;
            modalImagemPresente.src = imagemSrc;
            modalImagemPresente.alt = tituloOriginalDoPresenteSelecionado;

            miniFormulario.style.display = 'none';
            modalDescricaoPresente.style.display = 'block'; // Garante que a descrição é visível por padrão
            inputIdeiaPresente.value = '';
            inputDataPresente.value = '';
            inputObservacaoPresente.value = '';
            botaoAcaoModalPrincipal.style.display = 'inline-block';
            botaoAcaoModalPrincipal.disabled = false;

            // MODIFICADO: Todos os cartões, exceto o primeiro (ID "1"), usarão o formulário.
            if (presenteId !== '1') {
                botaoAcaoModalPrincipal.textContent = 'Criar!';
            } else { // É o primeiro cartão
                botaoAcaoModalPrincipal.textContent = 'Confirmar!';
            }

            modalPresente.classList.add('visivel');
            document.body.style.overflow = 'hidden';
        };

        const fecharModal = () => {
            modalPresente.classList.remove('visivel');
            document.body.style.overflow = '';
            miniFormulario.style.display = 'none';
            modalDescricaoPresente.style.display = 'block';
            botaoAcaoModalPrincipal.style.display = 'inline-block';
            // O texto do botaoAcaoModalPrincipal será resetado corretamente no 'finally'
            // ou na próxima vez que abrirModal for chamado.
            // Para garantir, podemos resetar aqui com base no idDoPresenteNoModalAtual se necessário,
            // mas o abrirModal já cuida disso ao reabrir.
            // Se preferir um reset imediato ao fechar:
            // if (idDoPresenteNoModalAtual && idDoPresenteNoModalAtual !== '1') {
            //     botaoAcaoModalPrincipal.textContent = 'Fazer Escolha';
            // } else {
            //     botaoAcaoModalPrincipal.textContent = 'Confirmar Escolha!';
            // }
            idDoPresenteNoModalAtual = null; // Limpa o ID ao fechar
        };

        botoesVerDetalhes.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                const cartaoClicado = evento.currentTarget.closest('.cartaoPresente');
                if (cartaoClicado) abrirModal(cartaoClicado);
            });
        });

        botaoFecharModal.addEventListener('click', fecharModal);
        modalPresente.addEventListener('click', (evento) => {
            if (evento.target === modalPresente) fecharModal();
        });
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && modalPresente.classList.contains('visivel')) fecharModal();
        });

        botaoAcaoModalPrincipal.addEventListener('click', () => {
            if (botaoAcaoModalPrincipal.textContent === 'Criar!') {
                modalDescricaoPresente.style.display = 'none';
                miniFormulario.style.display = 'block';
                botaoAcaoModalPrincipal.style.display = 'none';
            } else {
                console.log("Botão 'Confirmar!' (direto) clicado.");
                enviarEmailParaAppsScript({
                    tituloPresente: modalTituloPresente.textContent, // Usa o título ATUAL do modal
                    tipoEnvio: 'direto'
                });
            }
        });

        botaoSubmeterIdeia.addEventListener('click', () => {
            console.log("Botão 'Enviar Ideia' do formulário clicado.");
            const ideia = inputIdeiaPresente.value.trim();
            const data = inputDataPresente.value;
            const observacao = inputObservacaoPresente.value.trim();

            if (!ideia || !data) {
                alert("Por favor, preencha a sua ideia e a data sugerida.");
                return;
            }

            enviarEmailParaAppsScript({
                tituloPresente: tituloOriginalDoPresenteSelecionado, // Usa o título ORIGINAL do cartão
                ideiaDatePresente: ideia,
                dataEscolhida: data,
                observacao: observacao,
                tipoEnvio: 'formulario'
            });
        });

        function enviarEmailParaAppsScript(dadosDoPresente) {
            const botaoAcionado = dadosDoPresente.tipoEnvio === 'formulario' ? botaoSubmeterIdeia : botaoAcaoModalPrincipal;

            botaoAcionado.disabled = true;
            botaoAcionado.textContent = 'A Enviar...';

            // Substitua com os seus dados reais
            const seuEmailReal = 'valentinawpp25@gmail.com'; // SEU EMAIL
            const emailDelaReal = 'valesquiveel@gmail.com'; // EMAIL DELA
            const nomeRemetenteOpcional = 'Valentina'; // SEU NOME
            const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbyYBempnhUS2WO_chmqNZR4WC8jBiwdJ90u9NW-VR0iqiC0akrwgIbUmIlEACC0tDvCZA/exec'; // SEU URL DO SCRIPT

            const dadosParaEnviar = {
                seuEmail: seuEmailReal,
                emailDela: emailDelaReal,
                nomeRemetente: nomeRemetenteOpcional,
                tituloPresenteOriginal: dadosDoPresente.tituloPresente,
                ideiaDatePresente: dadosDoPresente.ideiaDatePresente || "",
                dataEscolhida: dadosDoPresente.dataEscolhida || "",
                observacao: dadosDoPresente.observacao || "",
                tipoEscolha: dadosDoPresente.tipoEnvio
            };

            console.log("A enviar dados para o Google Apps Script:", JSON.stringify(dadosParaEnviar));

            fetch(urlDoSeuGoogleAppsScript, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                body: JSON.stringify(dadosParaEnviar),
            })
            .then(response => {
                console.log('Requisição enviada para o Apps Script (modo no-cors).');
                alert('Notificação enviada com sucesso! Verifique a sua caixa de entrada (e a dela) em breve.');
                fecharModal();
            })
            .catch(error => {
                console.error('Erro de rede ao enviar para o Apps Script:', error);
                alert('Ocorreu um erro de rede ao tentar enviar a notificação.');
            })
            .finally(() => {
                botaoAcionado.disabled = false;
                if(botaoAcionado === botaoSubmeterIdeia) {
                    botaoAcionado.textContent = 'Enviar Ideia';
                    // Ao submeter ideia, o formulário é fechado, e o abrirModal cuidará do estado do botaoAcaoModalPrincipal se o modal for reaberto.
                    // O botaoAcaoModalPrincipal já deve estar escondido neste ponto, mas se precisar mostrá-lo:
                    // botaoAcaoModalPrincipal.style.display = 'inline-block';
                    // modalDescricaoPresente.style.display = 'block';
                } else { // botaoAcionado é botaoAcaoModalPrincipal
                     // Usa a variável idDoPresenteNoModalAtual que foi definida em abrirModal
                    if(idDoPresenteNoModalAtual && idDoPresenteNoModalAtual !== '1') {
                        botaoAcionado.textContent = 'Fazer Escolha';
                    } else {
                        botaoAcionado.textContent = 'Confirmar Escolha!';
                    }
                }
            });
        }

    } else {
        console.error("ERRO CRÍTICO NA CONFIGURAÇÃO DO MODAL OU FORMULÁRIO.");
    }
});