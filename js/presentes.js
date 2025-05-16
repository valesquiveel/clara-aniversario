document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM completamente carregado. A executar presentes.js");

            // --- Lógica do Carrossel ---
            const trilhaCarrossel = document.querySelector('.carrosselTrilha');
            const botaoProximo = document.getElementById('botaoCarrosselProximo');
            const botaoAnterior = document.getElementById('botaoCarrosselAnterior');
            const janelaCarrossel = document.querySelector('.carrosselJanela');

            if (trilhaCarrossel) {
                const cartoesPresente = Array.from(trilhaCarrossel.children);

                if (cartoesPresente.length > 0 && botaoProximo && botaoAnterior && janelaCarrossel) {
                    console.log("Elementos do carrossel encontrados. A configurar o carrossel.");
                    let larguraCartao = cartoesPresente[0].getBoundingClientRect().width;
                    let gapCarrossel = parseFloat(getComputedStyle(trilhaCarrossel).gap) || 20;
                    let indiceAtual = 0;
                    let cartoesVisiveis = Math.max(1, Math.floor(janelaCarrossel.offsetWidth / (larguraCartao + gapCarrossel)));

                    const moverParaCartao = (indiceAlvo) => {
                        if (!trilhaCarrossel) return;
                        const novoIndice = Math.max(0, Math.min(indiceAlvo, cartoesPresente.length - cartoesVisiveis));
                        const deslocamento = novoIndice * (larguraCartao + gapCarrossel);
                        trilhaCarrossel.style.transform = `translateX(-${deslocamento}px)`;
                        indiceAtual = novoIndice;
                        atualizarBotoesCarrossel();
                    };

                    const atualizarBotoesCarrossel = () => {
                        if (!botaoAnterior || !botaoProximo) return;
                        botaoAnterior.style.display = indiceAtual === 0 ? 'none' : 'flex';
                        const ultimoIndicePossivel = Math.max(0, cartoesPresente.length - cartoesVisiveis);
                        botaoProximo.style.display = indiceAtual >= ultimoIndicePossivel ? 'none' : 'flex';
                    };

                    botaoProximo.addEventListener('click', () => {
                        moverParaCartao(indiceAtual + 1);
                    });

                    botaoAnterior.addEventListener('click', () => {
                        moverParaCartao(indiceAtual - 1);
                    });

                    window.addEventListener('resize', () => {
                        if (cartoesPresente.length > 0 && janelaCarrossel && trilhaCarrossel) {
                            larguraCartao = cartoesPresente[0].getBoundingClientRect().width;
                            gapCarrossel = parseFloat(getComputedStyle(trilhaCarrossel).gap) || 20;
                            cartoesVisiveis = Math.max(1, Math.floor(janelaCarrossel.offsetWidth / (larguraCartao + gapCarrossel)));
                            moverParaCartao(indiceAtual); 
                            atualizarBotoesCarrossel();
                        }
                    });

                    moverParaCartao(0); 
                    atualizarBotoesCarrossel();

                } else {
                    console.warn("Alguns elementos do carrossel não foram encontrados.");
                }
            } else {
                console.error("Elemento .carrosselTrilha não encontrado.");
            }

            // --- Lógica do Modal ---
            console.log("A tentar configurar a lógica do Modal.");
            const modalPresente = document.getElementById('modalPresente');
            const botaoFecharModal = document.querySelector('.botaoFecharModal');
            const botoesVerDetalhes = document.querySelectorAll('.botaoVerDetalhesPresente');
            const modalImagemPresente = document.getElementById('modalImagemPresente');
            const modalTituloPresente = document.getElementById('modalTituloPresente');
            const modalDescricaoPresente = document.getElementById('modalDescricaoPresente');

            if (modalPresente && botaoFecharModal && botoesVerDetalhes.length > 0 && modalImagemPresente && modalTituloPresente && modalDescricaoPresente) {
                console.log("Todos os elementos do modal necessários foram encontrados.");

                const abrirModal = (cartao) => {
                    const titulo = cartao.dataset.presenteTitulo;
                    const descricao = cartao.dataset.presenteDescricao;
                    const imagemSrc = cartao.querySelector('.cartaoPresenteImagem').src; // Pega o src da imagem dentro do cartão

                    modalTituloPresente.textContent = titulo || "Detalhes do Presente";
                    modalDescricaoPresente.textContent = descricao || "Descrição não disponível.";
                    modalImagemPresente.src = imagemSrc || "https://placehold.co/300x200/f0f0f0/ccc?text=Sem+Imagem";
                    modalImagemPresente.alt = titulo || "Imagem do Presente";

                    modalPresente.classList.add('visivel');
                    document.body.style.overflow = 'hidden';
                };

                const fecharModal = () => {
                    modalPresente.classList.remove('visivel');
                    document.body.style.overflow = '';
                };

                botoesVerDetalhes.forEach(botao => {
                    botao.addEventListener('click', (evento) => {
                        const cartaoClicado = evento.currentTarget.closest('.cartaoPresente');
                        if (cartaoClicado) {
                            abrirModal(cartaoClicado);
                        }
                    });
                });

                botaoFecharModal.addEventListener('click', fecharModal);
                modalPresente.addEventListener('click', (evento) => {
                    if (evento.target === modalPresente) {
                        fecharModal();
                    }
                });
                document.addEventListener('keydown', (evento) => {
                    if (evento.key === 'Escape' && modalPresente.classList.contains('visivel')) {
                        fecharModal();
                    }
                });

                // --- NOVO: Lógica do Botão de Escolher Presente (Email) ---
                const botaoEscolherPresenteEmail = document.querySelector('.modalConteudo .botaoEscolherPresente');

                if (botaoEscolherPresenteEmail) {
                    botaoEscolherPresenteEmail.addEventListener('click', () => {
                        console.log("Botão 'Confirmar Escolha!' clicado para enviar e-mail.");

                        // SUBSTITUA COM OS E-MAILS REAIS
                        const seuEmail = 'valentinawpp25@gmail.com'; 
                        const emailDela = 'valesquiveel@gmail.com'; 
                        
                        const tituloDoPresente = modalTituloPresente.textContent;

                        const assunto = `Uma escolha de presente especial: ${tituloDoPresente}!`;
                        const corpoEmail = `
Olá!

Só para formalizar, o presente "${tituloDoPresente}" foi o escolhido para esta ocasião especial. 

Mal posso esperar para comemorarmos e aproveitarmos juntos!

Com todo carinho,
[Seu Nome Aqui - se quiser adicionar]
                        `;

                        let mailtoLink = `mailto:${seuEmail}`;
                        if (emailDela && emailDela !== 'valesquiveel@gmail.com') { // Adiciona 'ela' em CC se o email for válido
                            mailtoLink += `?cc=${emailDela}`;
                        }
                        mailtoLink += `${emailDela && emailDela !== 'valesquiveel@gmail.com' ? '&' : '?'}subject=${encodeURIComponent(assunto)}`;
                        mailtoLink += `&body=${encodeURIComponent(corpoEmail)}`;

                        console.log("Abrindo link mailto:", mailtoLink);
                        window.location.href = mailtoLink;

                        // Opcional: Fechar o modal após clicar em escolher
                        // fecharModal(); // Descomente se quiser que o modal feche
                    });
                } else {
                    console.warn("Botão '.botaoEscolherPresente' dentro do modal não encontrado para a funcionalidade de e-mail.");
                }

            } else {
                console.error("ERRO CRÍTICO NA CONFIGURAÇÃO DO MODAL: Um ou mais elementos essenciais do modal não foram encontrados.");
            }
        });