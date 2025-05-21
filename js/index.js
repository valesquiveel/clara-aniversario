        function animarRectFA() {
                const rectFA = document.getElementById('RectFA');
                const parafusos = document.getElementById('parafusos');
                const estrelas = document.getElementById('estrelas');
                const faMessage = document.getElementById('FA'); 
                // Corrigido para pegar o ID 'botao' do HTML
                const botaoContainerInicial = document.getElementById('botao'); 
                const botaoEstrela = document.getElementById('botaoEstrela'); 

                const conteudoFinal = document.getElementById('conteudoFinal');
                const cartaContainer = document.getElementById('cartaContainer');
                const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
                const folhaMensagem = document.getElementById('folhaMensagem');
                const envelopeBase = document.querySelector('.envelope-base'); 
                
                const botao2 = document.getElementById('botao2'); // Botão para "presentes.html"
                // const botaoCartaContainer = document.getElementById('botaoCartaContainer'); // Se for usar o botão na carta

                // Constantes de tempo da animação da folha (do seu JS)
                const delayTransformacaoFolha = 400;  
                const duracaoTransformacaoFolha = 1600; 

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

                // Adiciona a classe para animar RectFA um pouco depois dos elementos internos
                setTimeout(() => {
                    if (rectFA) {
                        rectFA.classList.add('animacao-desaparecer-rectfa');
                        console.log("Animação de desaparecer RectFA adicionada.");
                    }
                }, 300); // O CSS já tem um delay de 0.3s, então o JS pode aplicar direto ou com pequeno delay.
                        // Mantendo o delay do JS para garantir a sequência.

                // Delay para esconder RectFA e mostrar conteudoFinal + cartaContainer
                // A animação de sumir elementos é 0.7s. A de desaparecerRectFA é 1s (começa em 0.3s, termina em 1.3s).
                setTimeout(() => {
                    if (rectFA) rectFA.style.display = 'none'; 
                    elementosRectFA.forEach(el => { if (el) el.style.display = 'none';}); // Garante que sumam

                    if (conteudoFinal) {
                        conteudoFinal.style.display = 'flex'; 
                        console.log("conteudoFinal agora é flex.");
                    }
                    
                    if (cartaContainer) {
                        // A animação CSS '.animacao-aparecer-carta' já tem um delay de 0.2s.
                        // Aplicar a classe diretamente.
                        cartaContainer.classList.add('animacao-aparecer-carta');
                        console.log("Envelope (cartaContainer) aparecendo.");
                    }

                    // Adicionar listener de clique para a aba do envelope
                    // Este listener só é adicionado DEPOIS que cartaContainer começa a aparecer.
                    if (envelopeAbaSuperior) {
                        envelopeAbaSuperior.addEventListener('click', function openFlap() {
                            console.log("Aba do envelope clicada.");
                            this.classList.add('aberta'); // Abre a aba
                            console.log("Aba do envelope abrindo.");

                            // Lógica para a folha de mensagem e botão2, movida para DENTRO do clique
                            setTimeout(() => { // Pequeno delay para sincronizar com a abertura da aba
                                if (folhaMensagem) {
                                    folhaMensagem.classList.add('visivel');
                                    console.log("Folha de mensagem .visivel adicionada. Opacidade e transform animando.");
                                }

                                // O overflow do envelope-base é crucial para a folha sair
                                if (envelopeBase) {
                                     // Delay para overflow ser 'visible' um pouco antes da folha realmente precisar
                                    setTimeout(() => {
                                        envelopeBase.style.overflow = 'visible';
                                        console.log("Overflow do envelope-base definido para visible.");
                                    }, delayTransformacaoFolha - 100); // Ajustar se necessário
                                }
                                
                                // Tempo total para a folha terminar sua animação de saída
                                const tempoTotalAnimacaoFolha = delayTransformacaoFolha + duracaoTransformacaoFolha;
                                
                                setTimeout(() => {
                                    if (botao2) { // Mostrar o botão que leva para "presentes.html"
                                        botao2.style.display = 'block'; 
                                        void botao2.offsetWidth; // Forçar reflow para transição de opacidade
                                        botao2.style.opacity = '1';
                                        console.log("Botão 2 (para presentes.html) aparecendo.");
                                    }
                                    // Se quiser mostrar o botaoCartaContainer (o que chama acaoBotaoCarta) aqui:
                                    // const botaoCartaContainer = document.getElementById('botaoCartaContainer');
                                    // if (botaoCartaContainer) {
                                    //     botaoCartaContainer.style.display = 'block';
                                    //     void botaoCartaContainer.offsetWidth;
                                    //     botaoCartaContainer.style.opacity = '1';
                                    //     console.log("Botão Ação Carta (no rodapé) aparecendo.");
                                    // }
                                }, tempoTotalAnimacaoFolha + 100); // Aparece após a folha sair + buffer

                            }, 1000); // Delay após clique na aba, para a aba começar a abrir

                        }, { once: true }); // Listener executa apenas uma vez
                    }
                // O tempo total para RectFA sumir é ~1.3s (0.3s delay + 1s duração).
                // A animação da carta tem 0.2s delay + 1.2s duração = 1.4s.
                // Então, este timeout deve ser em torno de 1.3s para começar a carta.
                }, 1300); 
            }

            function acaoBotaoCarta() { // Este botão é o #botaoAcaoCarta
                console.log("Botão da carta (#botaoAcaoCarta) foi clicado!");

                const cartaContainer = document.getElementById('cartaContainer');
                const conteudoFinal = document.getElementById('conteudoFinal');
                const botao2 = document.getElementById('botao2'); // Ocultar este também

                if (cartaContainer) {
                    cartaContainer.classList.remove('animacao-aparecer-carta'); 
                    cartaContainer.classList.add('animacao-desaparecer-carta');
                }
                if (botao2) { // Esconder o botão de presentes também
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
                        const botaoCartaContainer = document.getElementById('botaoCartaContainer'); // O botão que chamou esta função
                        const envelopeBase = document.querySelector('.envelope-base');

                        if(envelopeAbaSuperior) envelopeAbaSuperior.classList.remove('aberta');
                        if(folhaMensagem) {
                            folhaMensagem.classList.remove('visivel');
                            folhaMensagem.style.transform = 'translateX(-50%) translateY(15px)'; // Reset para CSS inicial
                            folhaMensagem.style.opacity = '0';
                            folhaMensagem.style.zIndex = '3'; // Reset z-index para CSS inicial
                        }
                        if(botaoCartaContainer) { // Resetar o botão que foi clicado
                            botaoCartaContainer.style.display = 'none';
                            botaoCartaContainer.style.opacity = 0;
                        }
                        if(botao2){ // Garantir que o botão de presentes também seja resetado
                             botao2.style.display = 'none';
                        }
                        if(envelopeBase) envelopeBase.style.overflow = 'hidden'; 
                        if(cartaContainer) cartaContainer.style.opacity = 0; 
                    }
                     // Opcionalmente, reabilitar o primeiro botão estrela
                    // const botaoEstrela = document.getElementById('botaoEstrela');
                    // if (botaoEstrela) botaoEstrela.disabled = false;

                }, 1000); // Duração da animação de desaparecer
            }