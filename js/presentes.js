document.addEventListener('DOMContentLoaded', () => {
    const telaInicial = document.getElementById('tela-inicial');
    const botaoEntrarPresentes = document.getElementById('botao-entrar-presentes');
    const conteudoPrincipalPresentes = document.getElementById('conteudo-principal-presentes');

    if (botaoEntrarPresentes && telaInicial && conteudoPrincipalPresentes) {
        if (window.innerWidth < 421) {
            telaInicial.style.display = 'flex';
            conteudoPrincipalPresentes.style.display = 'none';
        } else {
            telaInicial.style.display = 'none';
            conteudoPrincipalPresentes.style.display = 'block';
        }

        botaoEntrarPresentes.addEventListener('click', () => {
            telaInicial.classList.add('escondida');
            setTimeout(() => {
                telaInicial.style.display = 'none';
            }, 500);
            conteudoPrincipalPresentes.style.display = 'block';
            window.dispatchEvent(new Event('resize'));
        });
    } else {
        if (conteudoPrincipalPresentes) {
            conteudoPrincipalPresentes.style.display = 'block';
        }
    }

    const trilhaCarrossel = document.querySelector('.carrosselTrilha');
    const botaoProximoCarrossel = document.getElementById('botaoCarrosselProximo');
    const botaoAnteriorCarrossel = document.getElementById('botaoCarrosselAnterior');
    const janelaCarrossel = document.querySelector('.carrosselJanela');
    
    let idDoPresenteNoModalAtual = null; 

    if (trilhaCarrossel) {
        const cartoesPresenteCarrossel = Array.from(trilhaCarrossel.children);
        if (cartoesPresenteCarrossel.length > 0 && botaoProximoCarrossel && botaoAnteriorCarrossel && janelaCarrossel) {
            let larguraCartao = 0;
            let gapCarrossel = 0;
            let indiceAtual = 0;
            let cartoesVisiveis = 1;

            const calcularDimensoesCarrossel = () => {
                if (cartoesPresenteCarrossel.length === 0 || !janelaCarrossel.offsetWidth) return;
                
                const primeiroCartao = cartoesPresenteCarrossel.find(c => c.offsetWidth > 0);
                if (!primeiroCartao) return;
                larguraCartao = primeiroCartao.getBoundingClientRect().width;
                
                const estiloTrilha = getComputedStyle(trilhaCarrossel);
                gapCarrossel = parseFloat(estiloTrilha.gap) || (parseFloat(estiloTrilha.columnGap) || 20);
                
                cartoesVisiveis = Math.max(1, Math.floor((janelaCarrossel.offsetWidth + gapCarrossel) / (larguraCartao + gapCarrossel)));
                indiceAtual = Math.max(0, Math.min(indiceAtual, cartoesPresenteCarrossel.length - cartoesVisiveis));
            };

            const moverParaCartao = (indiceAlvo) => {
                if (!trilhaCarrossel || cartoesPresenteCarrossel.length === 0) return;
                calcularDimensoesCarrossel();
                const novoIndice = Math.max(0, Math.min(indiceAlvo, cartoesPresenteCarrossel.length - cartoesVisiveis));
                const deslocamento = novoIndice * (larguraCartao + gapCarrossel);
                trilhaCarrossel.style.transform = `translateX(-${deslocamento}px)`;
                indiceAtual = novoIndice;
                atualizarBotoesCarrossel();
            };

            const atualizarBotoesCarrossel = () => {
                if (!botaoAnteriorCarrossel || !botaoProximoCarrossel || cartoesPresenteCarrossel.length === 0) return;
                botaoAnteriorCarrossel.style.display = indiceAtual === 0 ? 'none' : 'flex';
                const ultimoIndicePossivel = Math.max(0, cartoesPresenteCarrossel.length - cartoesVisiveis);
                botaoProximoCarrossel.style.display = indiceAtual >= ultimoIndicePossivel ? 'none' : 'flex';
            };

            botaoProximoCarrossel.addEventListener('click', () => moverParaCartao(indiceAtual + 1));
            botaoAnteriorCarrossel.addEventListener('click', () => moverParaCartao(indiceAtual - 1));

            window.addEventListener('resize', () => {
                if (cartoesPresenteCarrossel.length > 0 && janelaCarrossel && trilhaCarrossel && janelaCarrossel.offsetWidth > 0) {
                    moverParaCartao(indiceAtual);
                }
            });
            
            const inicializarCarrossel = () => {
                 if (janelaCarrossel.offsetWidth > 0) {
                    moverParaCartao(0);
                } else {
                    const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            moverParaCartao(0);
                            observer.disconnect();
                        }
                    }, { threshold: 0.01 }); // Um threshold baixo
                    observer.observe(janelaCarrossel);
                }
            };

            if (conteudoPrincipalPresentes.style.display !== 'none') {
                inicializarCarrossel();
            } else {
                 const observerConteudo = new MutationObserver((mutationsList, observer) => {
                    for(const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            if (conteudoPrincipalPresentes.style.display !== 'none') {
                                inicializarCarrossel();
                                observer.disconnect();
                                break;
                            }
                        }
                    }
                });
                observerConteudo.observe(conteudoPrincipalPresentes, { attributes: true });
            }

        } else {
            if (botaoProximoCarrossel) botaoProximoCarrossel.style.display = 'none';
            if (botaoAnteriorCarrossel) botaoAnteriorCarrossel.style.display = 'none';
        }
    }

    const modalPresente = document.getElementById('modalPresente');
    const botaoFecharModal = document.querySelector('.botaoFecharModal');
    const modalImagemPresente = document.getElementById('modalImagemPresente'); 
    const modalTituloPresente = document.getElementById('modalTituloPresente');
    const modalDescricaoPresente = document.getElementById('modalDescricaoPresente');
    
    const miniFormulario = document.getElementById('miniFormularioPresente');
    const inputIdeiaPresente = document.getElementById('ideiaPresente');
    const inputDataPresente = document.getElementById('dataPresente');
    const inputObservacaoPresente = document.getElementById('observacaoPresente');
    const botaoSubmeterIdeia = document.getElementById('botaoSubmeterIdeia');
    const botaoAcaoModalPrincipal = document.getElementById('botaoAcaoModalPrincipal');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackFormulario = document.getElementById('feedbackFormulario');


    let tituloOriginalDoPresenteSelecionado = ""; 

    if (modalPresente && botaoFecharModal && modalImagemPresente && modalTituloPresente && modalDescricaoPresente && miniFormulario && botaoAcaoModalPrincipal && botaoSubmeterIdeia) {
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
            if(feedbackModal) feedbackModal.textContent = '';
            if(feedbackFormulario) feedbackFormulario.textContent = '';
        };
        
        const abrirModal = (cartao) => {
            resetModalToDefaultView();
            const presenteId = cartao.dataset.presenteId; 
            idDoPresenteNoModalAtual = presenteId; 
            tituloOriginalDoPresenteSelecionado = cartao.dataset.presenteTitulo || "Presente";
            const descricao = cartao.dataset.presenteDescricao;
            const imagemSrc = cartao.dataset.presenteImagemReal || (cartao.querySelector('.cartaoPresenteImagem') ? cartao.querySelector('.cartaoPresenteImagem').src : 'https://placehold.co/300x200/EFEFEF/AAAAAA&text=Imagem');

            modalTituloPresente.textContent = tituloOriginalDoPresenteSelecionado;
            modalDescricaoPresente.textContent = descricao;
            
            if (modalImagemPresente) {
                modalImagemPresente.src = imagemSrc;
                modalImagemPresente.alt = tituloOriginalDoPresenteSelecionado;
            }
            
            if (idDoPresenteNoModalAtual === 'add') {
                modalTituloPresente.textContent = "Nova Ideia de Presente";
                if(modalDescricaoPresente) modalDescricaoPresente.style.display = 'none'; 
                if(modalImagemPresente) modalImagemPresente.style.display = 'none'; 
                if(miniFormulario) miniFormulario.style.display = 'block';
                if(botaoAcaoModalPrincipal) botaoAcaoModalPrincipal.style.display = 'none';
            } else {
                botaoAcaoModalPrincipal.textContent = 'Confirmar Minha Ideia!';
                 if(miniFormulario) miniFormulario.style.display = 'none';
                 if(botaoAcaoModalPrincipal) botaoAcaoModalPrincipal.style.display = 'inline-block';
            }
            
            modalPresente.classList.add('visivel');
            document.body.style.overflow = 'hidden';
        };

        const fecharModal = () => {
            modalPresente.classList.remove('visivel');
            document.body.style.overflow = '';
            resetModalToDefaultView(); 
            if (botaoAcaoModalPrincipal) {
                botaoAcaoModalPrincipal.textContent = 'Confirmar Minha Ideia!';
            }
            idDoPresenteNoModalAtual = null; 
        };

        document.querySelectorAll('.botaoVerDetalhesPresente').forEach(botao => {
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
            enviarEmailParaAppsScript({
                tituloPresente: modalTituloPresente.textContent, 
                tipoEnvio: 'direto' 
            });
        });
        
        botaoSubmeterIdeia.addEventListener('click', () => {
            const ideia = inputIdeiaPresente.value.trim();
            const data = inputDataPresente.value;
            const observacao = inputObservacaoPresente.value.trim();

            if (!ideia || !data) {
                if (feedbackFormulario) {
                    feedbackFormulario.textContent = "Por favor, preencha a sua ideia e a data sugerida.";
                    feedbackFormulario.style.color = 'red';
                    setTimeout(() => { if(feedbackFormulario) feedbackFormulario.textContent = ''; }, 3000);
                }
                return;
            }
            
            enviarEmailParaAppsScript({
                tituloPresente: "Nova Ideia de Presente",
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

            const textoOriginalBotao = botaoAcionado.textContent;
            botaoAcionado.disabled = true;
            botaoAcionado.textContent = 'A Enviar...';

            const seuEmailReal = 'valentinawpp25@gmail.com'; 
            const emailDelaReal = 'valesquiveel@gmail.com'; 
            const nomeRemetenteOpcional = 'Valentina'; 
            const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbzBoy_vW-f3dAYYHr-MRKHTAUAiKay5ig9FWc_hHF7AWqls4FxsuqPQvofb4JAjfEGzQw/exec';

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
                if (feedbackModal) {
                    feedbackModal.textContent = 'Notificação enviada com sucesso! Verifique a sua caixa de entrada.';
                    feedbackModal.style.color = 'green';
                }
                setTimeout(() => {
                    fecharModal(); 
                }, 2500);
            })
            .catch(error => {
                if (feedbackModal) {
                    feedbackModal.textContent = 'Ocorreu um erro de rede ao tentar enviar a notificação.';
                    feedbackModal.style.color = 'red';
                }
            })
            .finally(() => {
                botaoAcionado.disabled = false;
                botaoAcionado.textContent = textoOriginalBotao;
            });
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                })
                .catch(error => {
                });
        });
    }
});