document.addEventListener('DOMContentLoaded', () => {
    const trilhaCarrossel = document.querySelector('.carrosselTrilha');
    const botaoProximo = document.getElementById('botaoCarrosselProximo');
    const botaoAnterior = document.getElementById('botaoCarrosselAnterior');
    const janelaCarrossel = document.querySelector('.carrosselJanela');
    
    let idDoPresenteNoModalAtual = null;

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
        
        const resetModalToDefaultView = () => {
            if (modalImagemPresente) modalImagemPresente.style.display = 'block';
            if (modalDescricaoPresente) modalDescricaoPresente.style.display = 'block';
            if (miniFormulario) miniFormulario.style.display = 'none';
            if (botaoAcaoModalPrincipal) {
                botaoAcaoModalPrincipal.style.display = 'inline-block';
                botaoAcaoModalPrincipal.disabled = false;
            }
            if(inputIdeiaPresente) inputIdeiaPresente.value = '';
            if(inputDataPresente) inputDataPresente.value = '';
            if(inputObservacaoPresente) inputObservacaoPresente.value = '';
        };
        
        const abrirModal = (cartao) => {
            resetModalToDefaultView();

            const presenteId = cartao.dataset.presenteId;
            idDoPresenteNoModalAtual = presenteId;

            tituloOriginalDoPresenteSelecionado = cartao.dataset.presenteTitulo || "Presente";
            const descricao = cartao.dataset.presenteDescricao;
            const imagemSrc = cartao.dataset.presenteImagemReal || cartao.querySelector('.cartaoPresenteImagem').src;

            modalTituloPresente.textContent = tituloOriginalDoPresenteSelecionado;
            modalDescricaoPresente.textContent = descricao;
            
            if (modalImagemPresente) {
                modalImagemPresente.src = imagemSrc;
                modalImagemPresente.alt = tituloOriginalDoPresenteSelecionado;
            }
            
            if (idDoPresenteNoModalAtual !== '1') {
                botaoAcaoModalPrincipal.textContent = 'Criar!';
            } else {
                botaoAcaoModalPrincipal.textContent = 'Confirmar!';
            }
            
            modalPresente.classList.add('visivel');
            document.body.style.overflow = 'hidden';
        };

        const fecharModal = () => {
            modalPresente.classList.remove('visivel');
            document.body.style.overflow = '';
            resetModalToDefaultView();
            
            if (botaoAcaoModalPrincipal) {
                botaoAcaoModalPrincipal.textContent = 'Confirmar!';
            }
            idDoPresenteNoModalAtual = null;
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
                if(modalDescricaoPresente) modalDescricaoPresente.style.display = 'none';
                if(modalImagemPresente) modalImagemPresente.style.display = 'none';
                if(miniFormulario) miniFormulario.style.display = 'block';
                if(botaoAcaoModalPrincipal) botaoAcaoModalPrincipal.style.display = 'none';
            } else {
                enviarEmailParaAppsScript({
                    tituloPresente: modalTituloPresente.textContent,
                    tipoEnvio: 'direto'
                });
            }
        });
        
        botaoSubmeterIdeia.addEventListener('click', () => {
            const ideia = inputIdeiaPresente.value.trim();
            const data = inputDataPresente.value;
            const observacao = inputObservacaoPresente.value.trim();

            if (!ideia || !data) {
                alert("Por favor, preencha a sua ideia e a data sugerida.");
                return;
            }
            
            enviarEmailParaAppsScript({
                tituloPresente: tituloOriginalDoPresenteSelecionado,
                ideiaDatePresente: ideia,
                dataEscolhida: data,
                observacao: observacao,
                tipoEnvio: 'formulario'
            });
        });

        function enviarEmailParaAppsScript(dadosDoPresente) {
            const botaoAcionado = dadosDoPresente.tipoEnvio === 'formulario' ? botaoSubmeterIdeia : botaoAcaoModalPrincipal;
            
            if (!botaoAcionado) {
                return;
            }

            botaoAcionado.disabled = true;
            botaoAcionado.textContent = 'A Enviar...';

            const seuEmailReal = 'valentinawpp25@gmail.com';
            const emailDelaReal = 'valesquiveel@gmail.com';
            const nomeRemetenteOpcional = 'Valentina';
            const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbxpZ5czO3YSVx284PkSBmeA3Pxfes3-MvsAXJPAh9nPwpbFGsxWb-DVdHRgvcyJtv0fhw/exec';

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
            
            fetch(urlDoSeuGoogleAppsScript, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(dadosParaEnviar),
            })
            .then(response => {
                alert('Notificação enviada com sucesso! Verifique a sua caixa de entrada.');
                fecharModal();
            })
            .catch(error => {
                alert('Ocorreu um erro de rede ao tentar enviar a notificação.');
            })
            .finally(() => {
                botaoAcionado.disabled = false;
                if(botaoAcionado === botaoSubmeterIdeia) {
                    botaoAcionado.textContent = 'Enviar Ideia';
                }
            });
        }

    } else {
        // Este console.error será mantido pois é uma mensagem de erro importante para o desenvolvedor
        console.error("ERRO CRÍTICO NA CONFIGURAÇÃO DO MODAL OU FORMULÁRIO. Elementos em falta:", {
            modalPresente: !!modalPresente,
            botaoFecharModal: !!botaoFecharModal,
            botoesVerDetalhes: botoesVerDetalhes.length,
            modalImagemPresente: !!modalImagemPresente,
            modalTituloPresente: !!modalTituloPresente,
            modalDescricaoPresente: !!modalDescricaoPresente,
            miniFormulario: !!miniFormulario,
            botaoAcaoModalPrincipal: !!botaoAcaoModalPrincipal,
            botaoSubmeterIdeia: !!botaoSubmeterIdeia
        });
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js')
        .then(registration => {
            // Mantido pois é um log útil para o desenvolvedor
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
            // Mantido pois é um log útil para o desenvolvedor
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}