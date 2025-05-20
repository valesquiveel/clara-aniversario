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
                const envelopeBase = document.querySelector('.envelope-base'); 
                
                const botao2 = document.getElementById('botao2'); 

                console.log("Iniciando animação principal...");

                if (botao2) {
                    botao2.style.display = 'none';
                    botao2.style.opacity = '0';
                    console.log("Botão 2 (para presentes.html) oculto inicialmente.");
                }

                if (botaoEstrela) {
                    botaoEstrela.disabled = true; 
                    console.log("Botão estrela inicial desabilitado.");
                }

                const elementosRectFA = [parafusos, estrelas, faMessage, botaoContainerInicial];
                elementosRectFA.forEach(el => {
                    if (el) el.classList.add('animacao-sumir-elementos');
                });
                console.log("Animação de sumir elementos iniciais adicionada.");

                setTimeout(() => {
                    if (rectFA) {
                        rectFA.classList.add('animacao-desaparecer-rectfa');
                        console.log("Animação de desaparecer RectFA adicionada.");
                    }
                }, 300); 

                setTimeout(() => {
                    if (rectFA) rectFA.style.display = 'none'; 
                    elementosRectFA.forEach(el => { if (el) el.style.display = 'none';}); 

                    if (conteudoFinal) {
                        conteudoFinal.style.display = 'flex'; 
                        console.log("conteudoFinal agora é flex.");
                    }
                    
                    if (cartaContainer) {
                        cartaContainer.classList.add('animacao-aparecer-carta');
                        console.log("Envelope (cartaContainer) aparecendo.");
                    }

                    if (envelopeAbaSuperior) {
                        envelopeAbaSuperior.addEventListener('click', function openFlap() {
                            console.log("Aba do envelope clicada.");
                            this.classList.add('aberta'); 
                            console.log("Aba do envelope abrindo.");

                            if (folhaMensagem) {
                                // Tornar a folha "espiando" e clicável
                                folhaMensagem.classList.add('peek'); // Adiciona a classe para opacidade e cursor
                                console.log("Folha de mensagem agora 'peeking' e clicável (classe .peek adicionada).");

                                folhaMensagem.addEventListener('click', function showMessageFully() {
                                    console.log("Folha de mensagem clicada para sair totalmente.");
                                    this.classList.remove('peek'); // Remove a classe de "espiar"
                                    this.classList.add('visivel'); // Adiciona a classe para animação completa
                                    this.style.cursor = 'default'; // Restaura o cursor padrão
                                    console.log("Folha de mensagem .visivel adicionada.");

                                    if (envelopeBase) {
                                        // Delay para overflow ser 'visible' sincronizado com a animação da folha
                                        // A transição de transform em .visivel tem delay de 0.3s
                                        setTimeout(() => {
                                            envelopeBase.style.overflow = 'visible';
                                            console.log("Overflow do envelope-base definido para visible.");
                                        }, 300); // Coincide com o transition-delay do transform da folha
                                    }
                                    
                                    // CSS transition para transform é 1.5s duração + 0.3s delay = 1.8s total
                                    const duracaoAnimacaoFolhaVisivel = 1800;

                                    setTimeout(() => {
                                        if (botao2) { 
                                            botao2.style.display = 'block'; 
                                            void botao2.offsetWidth; 
                                            botao2.style.opacity = '1';
                                            console.log("Botão 2 (para presentes.html) aparecendo.");
                                        }
                                    }, duracaoAnimacaoFolhaVisivel + 100); // Aparece após a folha sair + buffer

                                }, { once: true }); // Listener da folha também executa uma vez
                            }
                        }, { once: true }); 
                    }
                }, 1300); 
            }

            function acaoBotaoCarta() { 
                console.log("Botão da carta (#botaoAcaoCarta) foi clicado!");

                const cartaContainer = document.getElementById('cartaContainer');
                const conteudoFinal = document.getElementById('conteudoFinal');
                const botao2 = document.getElementById('botao2'); 

                if (cartaContainer) {
                    cartaContainer.classList.remove('animacao-aparecer-carta'); 
                    cartaContainer.classList.add('animacao-desaparecer-carta');
                }
                if (botao2) { 
                    botao2.style.opacity = '0';
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
                        const envelopeBase = document.querySelector('.envelope-base');

                        if(envelopeAbaSuperior) envelopeAbaSuperior.classList.remove('aberta');
                        if(folhaMensagem) {
                            folhaMensagem.classList.remove('visivel');
                            folhaMensagem.classList.remove('peek'); // Remover também a classe peek
                            folhaMensagem.style.transform = 'translateX(-50%) translateY(15px)'; 
                            folhaMensagem.style.opacity = '0'; // Resetar opacidade
                            folhaMensagem.style.zIndex = '3'; 
                            folhaMensagem.style.cursor = 'default'; // Resetar cursor
                        }
                        if(botaoCartaContainer) { 
                            botaoCartaContainer.style.display = 'none';
                            botaoCartaContainer.style.opacity = 0;
                        }
                        if(botao2){ 
                             botao2.style.display = 'none';
                        }
                        if(envelopeBase) envelopeBase.style.overflow = 'hidden'; 
                        if(cartaContainer) cartaContainer.style.opacity = 0; 
                    }
                }, 1000); 
            }