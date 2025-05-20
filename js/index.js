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
    const envelopeBase = document.querySelector('.envelope-base'); // Certifique-se que este é o elemento correto

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
        elementosRectFA.forEach(el => { if (el) el.style.display = 'none'; });

        if (conteudoFinal) {
            conteudoFinal.style.display = 'flex';
            console.log("conteudoFinal agora é flex.");
        }

        if (cartaContainer) {
            cartaContainer.classList.add('animacao-aparecer-carta');
            console.log("Envelope (cartaContainer) aparecendo.");
        }

        if (envelopeAbaSuperior && folhaMensagem && envelopeBase) { // Adicionado envelopeBase na verificação
            envelopeAbaSuperior.addEventListener('click', function openFlap() {
                console.log("Aba do envelope clicada.");
                this.classList.add('aberta');
                console.log("Aba do envelope abrindo.");

                folhaMensagem.classList.add('peek');
                console.log("Folha de mensagem agora 'peeking' e clicável (classe .peek adicionada).");

                folhaMensagem.addEventListener('click', function showMessageFully() {
                    console.log("Folha de mensagem clicada para sair totalmente.");
                    this.classList.remove('peek');
                    this.classList.add('visivel'); // A transição de transform começará após 0.3s
                    this.style.cursor = 'default';
                    console.log("Folha de mensagem .visivel adicionada.");

                    // --- ALTERAÇÃO PRINCIPAL AQUI ---
                    // Mude o overflow para 'visible' imediatamente.
                    // A animação da folha (transform) tem um delay de 0.3s,
                    // então o envelope estará pronto quando a folha começar a mover.
                    envelopeBase.style.overflow = 'visible';
                    console.log("Overflow do envelope-base definido para visible (imediatamente).");
                    // --- FIM DA ALTERAÇÃO PRINCIPAL ---

                    const duracaoAnimacaoFolhaVisivel = 1800; // 1.5s (duração) + 0.3s (delay)

                    setTimeout(() => {
                        if (botao2) {
                            botao2.style.display = 'block';
                            void botao2.offsetWidth; // Forçar reflow para garantir que a transição de opacidade funcione
                            botao2.style.opacity = '1';
                            console.log("Botão 2 (para presentes.html) aparecendo.");
                        }
                    }, duracaoAnimacaoFolhaVisivel + 100);

                }, { once: true });
            }, { once: true });
        } else {
            if (!envelopeAbaSuperior) console.error("Elemento .envelope-aba-superior não encontrado!");
            if (!folhaMensagem) console.error("Elemento #folhaMensagem não encontrado!");
            if (!envelopeBase) console.error("Elemento .envelope-base não encontrado!");
        }
    }, 1300); // Delay para garantir que RectFA sumiu e animação da carta comece depois
}

// A função acaoBotaoCarta() permanece a mesma, pois lida com o fechamento/reset.
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
        botao2.style.opacity = '0'; // Esconder o botão 2 ao fechar a carta
    }

    setTimeout(() => {
        if (conteudoFinal) {
            conteudoFinal.style.display = 'none';
        }
        if (cartaContainer) {
            cartaContainer.style.display = 'none'; // Esconder após a animação
            cartaContainer.classList.remove('animacao-desaparecer-carta');

            // Resetar estado da carta para uma possível reabertura (se aplicável no seu fluxo)
            const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
            const folhaMensagem = document.getElementById('folhaMensagem');
            const botaoCartaContainer = document.getElementById('botaoCartaContainer');
            const envelopeBase = document.querySelector('.envelope-base');

            if (envelopeAbaSuperior) envelopeAbaSuperior.classList.remove('aberta');
            if (folhaMensagem) {
                folhaMensagem.classList.remove('visivel');
                folhaMensagem.classList.remove('peek');
                folhaMensagem.style.transform = 'translateX(-50%) translateY(15px)'; // Posição inicial
                folhaMensagem.style.opacity = '0'; // Opacidade inicial
                folhaMensagem.style.zIndex = '3'; // z-index CSS base
                folhaMensagem.style.cursor = 'default'; // Cursor padrão
            }
            if (botaoCartaContainer) {
                botaoCartaContainer.style.display = 'none';
                botaoCartaContainer.style.opacity = '0';
            }
            if(botao2){ // Também esconder o botão 2 no reset
                 botao2.style.display = 'none';
            }
            if (envelopeBase) envelopeBase.style.overflow = 'hidden'; // Resetar overflow
            if (cartaContainer) cartaContainer.style.opacity = '0'; // Resetar opacidade para reaparecer
        }
    }, 1000); // Duração da animacao-desaparecer-carta
}