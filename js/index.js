function animarRectFA() {
    const rectFA = document.getElementById('RectFA');
    const parafusos = document.getElementById('parafusos');
    const estrelas = document.getElementById('estrelas');
    const faMessage = document.getElementById('FA');
    const botaoContainerInicial = document.getElementById('botao');
    const botaoEstrela = document.getElementById('botaoEstrela');
    const imgFlowers = document.getElementById('divimgFlower');

    const conteudoFinal = document.getElementById('conteudoFinal');
    const cartaContainer = document.getElementById('cartaContainer');
    const envelopeAbaSuperior = document.querySelector('.envelope-aba-superior');
    const folhaMensagem = document.getElementById('folhaMensagem');
    const envelopeBase = document.querySelector('.envelope-base');
    
    const botao2 = document.getElementById('botao2');

    const delayTransformacaoFolha = 400;
    const duracaoTransformacaoFolha = 1600;

    if (botao2) {
        botao2.style.display = 'none';
        botao2.style.opacity = '0';
    }

    if (botaoEstrela) {
        botaoEstrela.disabled = true;
    }

    const elementosQueSempreSomem = [parafusos, estrelas, faMessage, botaoContainerInicial];
    
    elementosQueSempreSomem.forEach(el => {
        if (el) el.classList.add('animacao-sumir-elementos');
    });

    if (imgFlowers) {
        if (window.matchMedia('(max-width: 420px)').matches) {
            imgFlowers.classList.add('animacao-sumir-elementos');
        }
    }

    setTimeout(() => {
        if (rectFA) {
            rectFA.classList.add('animacao-desaparecer-rectfa');
        }
    }, 300);

    setTimeout(() => {
        if (rectFA) rectFA.style.display = 'none';
        
        elementosQueSempreSomem.forEach(el => { if (el) el.style.display = 'none'; });

        if (imgFlowers) {
            if (window.matchMedia('(max-width: 420px)').matches) {
                imgFlowers.style.display = 'none';
            }
        }

        if (conteudoFinal) {
            conteudoFinal.style.display = 'flex';
        }
        
        if (cartaContainer) {
            cartaContainer.classList.add('animacao-aparecer-carta');
        }

        if (envelopeAbaSuperior) {
            envelopeAbaSuperior.addEventListener('click', function openFlap() {
                this.classList.add('aberta');

                setTimeout(() => {
                    if (folhaMensagem) {
                        folhaMensagem.classList.add('visivel');
                    }
                    if (envelopeBase) {
                        setTimeout(() => {
                            envelopeBase.style.overflow = 'visible';
                        }, delayTransformacaoFolha - 100);
                    }
                    
                    const tempoTotalAnimacaoFolha = delayTransformacaoFolha + duracaoTransformacaoFolha;
                    
                    setTimeout(() => {
                        if (botao2) {
                            botao2.style.display = 'block';
                            void botao2.offsetWidth;
                            botao2.style.opacity = '1';
                        }
                    }, tempoTotalAnimacaoFolha + 100);
                }, 1000);
            }, { once: true });
        }
    }, 1300);
}

function acaoBotaoCarta() {
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
                folhaMensagem.style.transform = 'translateX(-50%) translateY(15px)'; 
                folhaMensagem.style.opacity = '0';
                folhaMensagem.style.zIndex = '3'; 
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