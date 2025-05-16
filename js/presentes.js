document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM completamente carregado. A executar presentes.js");

            // --- Lógica do Carrossel (mantida como no seu original) ---
            const trilhaCarrossel = document.querySelector('.carrosselTrilha');
            const botaoProximo = document.getElementById('botaoCarrosselProximo');
            const botaoAnterior = document.getElementById('botaoCarrosselAnterior');
            const janelaCarrossel = document.querySelector('.carrosselJanela');

            if (trilhaCarrossel) {
                const cartoesPresente = Array.from(trilhaCarrossel.children);
                if (cartoesPresente.length > 0 && botaoProximo && botaoAnterior && janelaCarrossel) {
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

                    botaoProximo.addEventListener('click', () => moverParaCartao(indiceAtual + 1));
                    botaoAnterior.addEventListener('click', () => moverParaCartao(indiceAtual - 1));

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
                }
            }

            // --- Lógica do Modal (mantida como no seu original, com pequena correção na imagem) ---
            const modalPresente = document.getElementById('modalPresente');
            const botaoFecharModal = document.querySelector('.botaoFecharModal');
            const botoesVerDetalhes = document.querySelectorAll('.botaoVerDetalhesPresente');
            const modalImagemPresente = document.getElementById('modalImagemPresente');
            const modalTituloPresente = document.getElementById('modalTituloPresente');
            const modalDescricaoPresente = document.getElementById('modalDescricaoPresente');

            if (modalPresente && botaoFecharModal && botoesVerDetalhes.length > 0 && modalImagemPresente && modalTituloPresente && modalDescricaoPresente) {
                const abrirModal = (cartao) => {
                    const titulo = cartao.dataset.presenteTitulo;
                    const descricao = cartao.dataset.presenteDescricao;
                    // Usa o data-attribute 'data-presente-imagem-real' para a imagem do modal
                    const imagemSrc = cartao.dataset.presenteImagemReal || cartao.querySelector('.cartaoPresenteImagem').src;

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

                // --- MODIFICADO: Lógica do Botão de Escolher Presente (Envio para Google Apps Script) ---
                const botaoEscolherPresenteEmail = document.querySelector('.modalConteudo .botaoEscolherPresente');

                if (botaoEscolherPresenteEmail) {
                    botaoEscolherPresenteEmail.addEventListener('click', () => {
                        console.log("Botão 'Confirmar Escolha!' clicado.");

                        // ---------------------------------------------------------------------------
                        // !! IMPORTANTE: SUBSTITUA OS VALORES ABAIXO COM OS SEUS DADOS REAIS !!
                        // ---------------------------------------------------------------------------
                        const seuEmailReal = 'valentinawpp25@gmail.com'; // Ex: o seu Gmail
                        const emailDelaReal = 'valesquiveel@gmail.com'; 
                        const nomeRemetenteOpcional = 'Valentina'; // Opcional, para o corpo do e-mail

                        // COLE AQUI O URL PUBLICADO DO SEU GOOGLE APPS SCRIPT (da Parte 1, passo 6)
                        const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbzBYVb0PhzdFSXmE3J_mD7XCRyPmjKfQ9IgkyJQGHo50bjoLeEJjoDC9iUEkVd1xSvHZA/exec';
                        // ---------------------------------------------------------------------------
                        
                        // Validação simples para garantir que os placeholders foram alterados
                        

                        const tituloDoPresenteEscolhido = modalTituloPresente.textContent;
                        
                        botaoEscolherPresenteEmail.disabled = true;
                        botaoEscolherPresenteEmail.textContent = 'A Enviar...';

                        const dadosParaEnviar = {
                            tituloPresente: tituloDoPresenteEscolhido,
                            seuEmail: seuEmailReal,
                            emailDela: emailDelaReal,
                            nomeRemetente: nomeRemetenteOpcional
                        };

                        console.log("A enviar dados para o Google Apps Script:", JSON.stringify(dadosParaEnviar));
                        console.log("URL do Script:", urlDoSeuGoogleAppsScript);

                        fetch(urlDoSeuGoogleAppsScript, {
                            method: 'POST',
                            mode: 'no-cors', // Alterado para 'no-cors' para simplificar o redirecionamento do Apps Script
                                            // O Apps Script precisa retornar ContentService.createTextOutput(...)
                                            // e não pode definir cabeçalhos CORS complexos facilmente para POST de text/plain.
                                            // Com 'no-cors', o JavaScript do cliente não poderá ler a resposta do servidor,
                                            // mas a requisição POST ainda será enviada.
                                            // O feedback de sucesso/erro será mais limitado no lado do cliente.
                            cache: 'no-cache',
                            headers: {
                                // Content-Type é omitido quando mode: 'no-cors' para certos tipos de requisição,
                                // ou pode ser 'text/plain' se o servidor não reclamar.
                                // Para e.postData.contents, o Apps Script geralmente espera text/plain.
                                // No entanto, com 'no-cors', o browser pode restringir cabeçalhos.
                                // Vamos enviar como string e o Apps Script faz JSON.parse(e.postData.contents).
                            },
                            body: JSON.stringify(dadosParaEnviar), 
                        })
                        .then(response => {
                            // Com mode: 'no-cors', não podemos ler a response.status ou response.json() diretamente.
                            // A requisição é enviada, mas o cliente não tem acesso à resposta detalhada.
                            // Assumimos sucesso se não houver erro de rede imediato.
                            console.log('Requisição enviada para o Apps Script (modo no-cors). Verifique os logs do Apps Script e a caixa de entrada para confirmação.');
                            alert('Notificação do presente enviada! Verifique a sua caixa de entrada (e a dela) em breve.'); 
                            fecharModal(); 
                        })
                        .catch(error => {
                            console.error('Erro de rede ao enviar para o Apps Script:', error);
                            alert('Ocorreu um erro de rede ao tentar enviar a notificação. Verifique a consola para mais detalhes e certifique-se que o URL do Apps Script está correto e publicado.');
                        })
                        .finally(() => {
                            botaoEscolherPresenteEmail.disabled = false;
                            botaoEscolherPresenteEmail.textContent = 'Confirmar Escolha!';
                        });
                    });
                } else {
                    console.warn("Botão '.botaoEscolherPresente' dentro do modal não encontrado.");
                }
            } else {
                console.error("ERRO CRÍTICO NA CONFIGURAÇÃO DO MODAL.");
            }
        });