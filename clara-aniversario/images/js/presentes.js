// Espera que o DOM esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado. A executar proxima_pagina.js");

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
            // Garante que cartoesVisiveis é pelo menos 1, e calcula com base na largura da janela e dos cartões
            let cartoesVisiveis = Math.max(1, Math.floor(janelaCarrossel.offsetWidth / (larguraCartao + gapCarrossel)));

            const moverParaCartao = (indiceAlvo) => {
                if (!trilhaCarrossel) return;
                // Garante que o índice alvo não exceda os limites
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
                // Avança um "ecrã" de cartões, ou até ao fim se for menos que um ecrã completo
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
                    moverParaCartao(indiceAtual); // Reajusta para o índice atual com as novas dimensões
                    atualizarBotoesCarrossel();
                }
            });

            moverParaCartao(0); // Inicia na primeira posição
            atualizarBotoesCarrossel();

        } else {
            console.warn("Alguns elementos do carrossel não foram encontrados. A funcionalidade do carrossel pode estar comprometida.");
            if (cartoesPresente.length === 0) console.warn("Nenhum cartão de presente encontrado em .carrosselTrilha");
            // ... (outras verificações de elementos do carrossel)
        }
    } else {
        console.error("Elemento .carrosselTrilha não encontrado. Carrossel não pode ser inicializado.");
    }


    // --- Lógica do Modal ---
    console.log("A tentar configurar a lógica do Modal.");
    const modalPresente = document.getElementById('modalPresente');
    const botaoFecharModal = document.querySelector('.botaoFecharModal');
    const botoesVerDetalhes = document.querySelectorAll('.botaoVerDetalhesPresente');

    const modalImagemPresente = document.getElementById('modalImagemPresente');
    const modalTituloPresente = document.getElementById('modalTituloPresente');
    const modalDescricaoPresente = document.getElementById('modalDescricaoPresente');

    console.log(`Número de botões 'Ver Detalhes' (.botaoVerDetalhesPresente) encontrados: ${botoesVerDetalhes.length}`);
    if (!modalPresente) console.error("Erro Crítico: Elemento modal com ID 'modalPresente' NÃO encontrado.");
    if (!botaoFecharModal) console.warn("Aviso: Botão de fechar modal com classe 'botaoFecharModal' NÃO encontrado.");
    if (!modalImagemPresente) console.warn("Aviso: Imagem do modal com ID 'modalImagemPresente' NÃO encontrada.");
    if (!modalTituloPresente) console.warn("Aviso: Título do modal com ID 'modalTituloPresente' NÃO encontrado.");
    if (!modalDescricaoPresente) console.warn("Aviso: Descrição do modal com ID 'modalDescricaoPresente' NÃO encontrada.");


    if (modalPresente && botaoFecharModal && botoesVerDetalhes.length > 0 && modalImagemPresente && modalTituloPresente && modalDescricaoPresente) {
        console.log("Todos os elementos do modal necessários foram encontrados. A adicionar event listeners aos botões 'Ver Detalhes'.");

        const abrirModal = (cartao) => {
            console.log("Função abrirModal chamada para o cartão:", cartao);
            const titulo = cartao.dataset.presenteTitulo;
            const descricao = cartao.dataset.presenteDescricao;
            const imagemSrc = cartao.dataset.presenteImagem;

            console.log("Dados do cartão a exibir no modal:", { titulo, descricao, imagemSrc });

            modalTituloPresente.textContent = titulo || "Detalhes do Presente";
            modalDescricaoPresente.textContent = descricao || "Descrição não disponível.";
            modalImagemPresente.src = imagemSrc || "https://placehold.co/300x200/f0f0f0/ccc?text=Sem+Imagem";
            modalImagemPresente.alt = titulo || "Imagem do Presente";

            modalPresente.classList.add('visivel');
            console.log("Classe 'visivel' adicionada ao modalPresente. O modal deve estar visível agora.");
            document.body.style.overflow = 'hidden'; // Impede o scroll da página ao fundo
        };

        const fecharModal = () => {
            console.log("Função fecharModal chamada.");
            modalPresente.classList.remove('visivel');
            document.body.style.overflow = ''; // Restaura o scroll da página
        };

        botoesVerDetalhes.forEach((botao, index) => {
            console.log(`A adicionar event listener ao botão 'Ver Detalhes' #${index + 1} (de ${botoesVerDetalhes.length})`);
            botao.addEventListener('click', (evento) => {
                console.log("Botão 'Ver Detalhes' clicado!", evento.currentTarget);
                const cartaoClicado = evento.currentTarget.closest('.cartaoPresente');
                if (cartaoClicado) {
                    console.log("Cartão pai (.cartaoPresente) encontrado:", cartaoClicado);
                    abrirModal(cartaoClicado);
                } else {
                    console.error("Erro: Cartão pai (.cartaoPresente) não encontrado para o botão clicado. O modal não pode ser preenchido.");
                }
            });
        });

        botaoFecharModal.addEventListener('click', fecharModal);

        modalPresente.addEventListener('click', (evento) => {
            if (evento.target === modalPresente) { // Verifica se o clique foi diretamente na camada de fundo
                console.log("Clique na camada de fundo do modal. A fechar modal.");
                fecharModal();
            }
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && modalPresente.classList.contains('visivel')) {
                console.log("Tecla Escape pressionada com modal visível. A fechar modal.");
                fecharModal();
            }
        });

    } else {
        console.error("ERRO CRÍTICO NA CONFIGURAÇÃO DO MODAL: Um ou mais elementos essenciais do modal não foram encontrados OU nenhum botão 'Ver Detalhes' foi detectado. Verifique os IDs e classes no HTML e no JavaScript.");
        if (botoesVerDetalhes.length === 0) {
            console.error("CAUSA PROVÁVEL: Nenhum elemento com a classe '.botaoVerDetalhesPresente' foi encontrado. Verifique se os botões nos seus cartões têm EXATAMENTE esta classe.");
        }
    }

});