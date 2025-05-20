function animarRectFA() {
            const rectFA = document.getElementById('RectFA');
            const parafusos = document.getElementById('parafusos');
            const estrelas = document.getElementById('estrelas');
            const faMessage = document.getElementById('FA');
            const botaoContainerInicial = document.getElementById('botao');
            const botaoEstrela = document.getElementById('botaoEstrela');

            const conteudoFinal = document.getElementById('conteudoFinal');
            const cartaContainer = document.getElementById('cartaContainer');
            const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
            const folhaMensagem = document.getElementById('folhaMensagem');
            const botaoCartaContainer = document.getElementById('botaoCartaContainer');
            const envelopeBase = document.querySelector('.envelope-base');


            if (botaoEstrela) {
                 botaoEstrela.disabled = true;
            }

            const elementosParaApagar = [parafusos, estrelas, faMessage, botaoContainerInicial];
            elementosParaApagar.forEach(el => {
                if (el) el.classList.add('animacao-sumir-elementos');
            });

            setTimeout(() => {
                if (rectFA) {
                    rectFA.classList.add('animacao-desaparecer-rectfa');
                }
            }, 300);

            setTimeout(() => {
                if (rectFA) rectFA.style.display = 'none';
                elementosParaApagar.forEach(e => { if(e) e.style.display = 'none'; });

                if (conteudoFinal) conteudoFinal.style.display = "flex";

                if (cartaContainer) {
                    setTimeout(() => {
                        cartaContainer.classList.add('animacao-aparecer-carta');
                    }, 100);
                }

                if (envelopeAbaSuperior) {
                    envelopeAbaSuperior.addEventListener('click', function openFlap() {
                        this.classList.add('aberta');
                        // Não é mais necessário mudar o overflow da base, pois a folha é um irmão
                        // if(envelopeBase) envelopeBase.style.overflow = 'visible'; 

                        if (folhaMensagem) {
                            folhaMensagem.classList.add('visivel');
                        }

                        if (botaoCartaContainer) {
                            setTimeout(() => {
                                botaoCartaContainer.style.display = 'block';
                                botaoCartaContainer.style.opacity = 1;
                            }, 600); 
                        }
                    }, { once: true }); 
                }
            }, 1400); 
        }

        function acaoBotaoCarta() {
            console.log("Botão da carta aberta foi clicado!");

            const cartaContainer = document.getElementById('cartaContainer');
            const conteudoFinal = document.getElementById('conteudoFinal');

            if (cartaContainer) {
                cartaContainer.classList.remove('animacao-aparecer-carta'); 
                cartaContainer.classList.add('animacao-desaparecer-carta');
            }

            setTimeout(() => {
                if (conteudoFinal) {
                     conteudoFinal.style.display = 'none';
                }
                if (cartaContainer) {
                     cartaContainer.style.display = 'none'; 
                     cartaContainer.classList.remove('animacao-desaparecer-carta'); 

                     const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
                     const folhaMensagem = document.getElementById('folhaMensagem');
                     const botaoCartaContainer = document.getElementById('botaoCartaContainer');
                     // const envelopeBase = document.querySelector('.envelope-base'); // Não precisa mais interagir com overflow

                     if(envelopeAbaSuperior) envelopeAbaSuperior.classList.remove('aberta');
                     if(folhaMensagem) {
                        folhaMensagem.classList.remove('visivel');
                        // Reset initial transform and opacity for next animation if needed
                        folhaMensagem.style.transform = 'translateX(-50%) translateY(-180px)'; 
                        folhaMensagem.style.opacity = '0';
                        folhaMensagem.style.zIndex = '3'; // Reset z-index
                     }
                     if(botaoCartaContainer) {
                        botaoCartaContainer.style.display = 'none';
                        botaoCartaContainer.style.opacity = 0;
                     }
                     // if(envelopeBase) envelopeBase.style.overflow = 'hidden'; // Não é mais necessário
                     if(cartaContainer) cartaContainer.style.opacity = 0; 
                }
            }, 1000); 
        }