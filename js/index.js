        function animarRectFA() {
            const rectFA = document.getElementById('RectFA');
            const parafusos = document.getElementById('parafusos');
            const estrelas = document.getElementById('estrelas');
            const faMessage = document.getElementById('FA'); 
            const botaoContainer = document.getElementById('botaoContainer'); 
            const botaoEstrela = document.getElementById('botaoEstrela'); 

            const conteudoFinal = document.getElementById('conteudoFinal');
            const cartaContainer = document.getElementById('cartaContainer');
            const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
            const folhaMensagem = document.getElementById('folhaMensagem');
            const envelopeBase = document.querySelector('.envelope-base'); 
            
            // Referência para o NOVO botao2 (o container da estrela na carta)
            const botao2 = document.getElementById('botao2'); 

            const delayTransformacaoFolha = 400;  
            const duracaoTransformacaoFolha = 1600; 

            console.log("Iniciando animação principal...");

            if (botao2) {
                botao2.style.display = 'none';
                botao2.style.opacity = '0';
                console.log("Botão 2 (na carta) oculto inicialmente.");
            }

            if (botaoEstrela) {
                botaoEstrela.disabled = true; 
                console.log("Botão estrela inicial desabilitado.");
            }

            const elementosRectFA = [parafusos, estrelas, faMessage, botaoContainer];
            elementosRectFA.forEach(el => {
                if (el) el.classList.add('animacao-sumir-elementos');
            });
            console.log("Animação de sumir elementos iniciais adicionada.");

            if (rectFA) rectFA.classList.add('animacao-desaparecer-rectfa');
            console.log("Animação de desaparecer RectFA adicionada.");
            
            setTimeout(() => {
                if (rectFA) rectFA.style.display = 'none'; 
                if (conteudoFinal) {
                    conteudoFinal.style.display = 'flex'; 
                    console.log("conteudoFinal agora é flex.");
                }
                
                if (cartaContainer) {
                    cartaContainer.classList.add('animacao-aparecer-carta');
                    console.log("Envelope (cartaContainer) aparecendo.");
                }

                setTimeout(() => {
                    if (envelopeAbaSuperior) {
                        envelopeAbaSuperior.classList.add('aberta');
                        console.log("Aba do envelope abrindo.");
                    }

                    setTimeout(() => {
                        if (folhaMensagem) {
                            folhaMensagem.classList.add('visivel');
                            console.log("Folha de mensagem .visivel adicionada. Opacidade e transform animando.");

                            setTimeout(() => {
                                if (envelopeBase) {
                                    envelopeBase.style.overflow = 'visible';
                                    console.log("Overflow do envelope-base definido para visible.");
                                }
                            }, delayTransformacaoFolha - 50); 

                            const tempoTotalAnimacaoFolha = delayTransformacaoFolha + duracaoTransformacaoFolha;
                            
                            setTimeout(() => {
                                // Mostrar o botao2 que está DENTRO da folhaMensagem
                                if (botao2) {
                                    botao2.style.display = 'block'; // Ou 'flex' se #botao2 for um container flex
                                    void botao2.offsetWidth; // Forçar reflow para transição
                                    botao2.style.opacity = '1';
                                    console.log("Botão 2 (na carta) aparecendo.");
                                }
                            }, tempoTotalAnimacaoFolha + 300); // Aparece após a folha sair + pequeno buffer

                        }
                    }, 700); 

                }, 1400); 

            }, 1300); 
        }

        