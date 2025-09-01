const firebaseConfig = {
            apiKey: "AIzaSyA8Mo82Lmct-jme4JOF70SYpX0faQ_mF6Y",
            authDomain: "clara-aniversario.firebaseapp.com",
            projectId: "clara-aniversario",
            storageBucket: "clara-aniversario.firebasestorage.app",
            messagingSenderId: "971175473120",
            appId: "1:971175473120:web:2f73feb1070c216abc0585"
        };

firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const storage = firebase.storage();

        document.addEventListener('DOMContentLoaded', () => {
            const giftCardContainer = document.getElementById('giftCardContainer');
            const addCardBtn = document.getElementById('addCardBtn');
            const modal = document.getElementById('modalPresente');
            const closeModalBtn = modal.querySelector('.botaoFecharModal');

            const viewMode = document.getElementById('viewMode');
            const editModeForm = document.getElementById('editModeForm');
            const emailForm = document.getElementById('miniFormularioPresente');
            
            const modalImage = document.getElementById('modalImagem');
            const modalTitle = document.getElementById('modalTitulo');
            const modalDescription = document.getElementById('modalDescricao');
            const sendEmailBtn = document.getElementById('sendEmailBtn');

            const imageUpload = document.getElementById('imageUpload');
            const imagePreviewContainer = document.getElementById('imagePreviewContainer');
            const imagePreview = document.getElementById('imagePreview');
            const imagePreviewText = document.getElementById('imagePreviewText');
            const ideaTitleInput = document.getElementById('ideaTitle');
            const ideaDescriptionInput = document.getElementById('ideaDescription');
            
            const submitEmailBtn = document.getElementById('botaoSubmeterIdeia');
            const dateInput = document.getElementById('dataPresente');
            const observationInput = document.getElementById('observacaoPresente');

            let currentCardId = null;
            const coupleId = "casal_unico_id"; // ID compartilhado para vocês dois

            // --- LÓGICA DE DADOS (Firebase) ---
            function loadCards() {
                db.collection('couples').doc(coupleId).collection('cards').onSnapshot(snapshot => {
                    giftCardContainer.innerHTML = '';
                    if (snapshot.empty) {
                        addNewCard(); addNewCard(); addNewCard();
                    } else {
                        snapshot.forEach(doc => {
                            const cardElement = createCardElement(doc.id, doc.data());
                            giftCardContainer.appendChild(cardElement);
                        });
                    }
                });
            }

            function createCardElement(id, data) {
                const card = document.createElement('div');
                card.className = 'cartaoPresente';
                card.dataset.id = id;

                const imageUrl = data.imageUrl || 'https://placehold.co/220x160/215a6d/FDFAF7?text=Nova+Ideia';
                const title = data.title || 'Um Momento Só Nosso';
                const description = data.description ? (data.description.substring(0, 50) + '...') : 'Crie aqui a sua ideia de presente!';

                card.innerHTML = `
                    <button class="botaoDeletarCard" aria-label="Apagar cartão">&times;</button>
                    <img src="${imageUrl}" alt="${title}" class="cartaoPresenteImagem">
                    <h3 class="cartaoPresenteTitulo">${title}</h3>
                    <p class="cartaoPresenteDescCurta">${description}</p>
                    <button class="botaoVerDetalhesPresente">Ver Detalhes</button>
                `;
                return card;
            }

            async function addNewCard() {
                try {
                    await db.collection('couples').doc(coupleId).collection('cards').add({
                        title: '', description: '', imageUrl: ''
                    });
                } catch (error) {
                    console.error("Erro ao adicionar novo cartão: ", error);
                }
            }
            
            async function deleteCard(cardId) {
                if (!confirm("Tem a certeza que quer apagar esta ideia? Esta ação não pode ser desfeita.")) {
                    return;
                }

                try {
                    const cardRef = db.collection('couples').doc(coupleId).collection('cards').doc(cardId);
                    const doc = await cardRef.get();

                    if (doc.exists) {
                        const data = doc.data();
                        if (data.imageUrl && data.imageUrl.includes('firebasestorage.googleapis.com')) {
                            const imageRef = storage.refFromURL(data.imageUrl);
                            await imageRef.delete();
                        }
                    }
                    await cardRef.delete();
                } catch (error) {
                    console.error("Erro ao apagar o cartão: ", error);
                    alert("Ocorreu um erro ao tentar apagar a ideia.");
                }
            }

            async function openModal(cardElement) {
                currentCardId = cardElement.dataset.id;
                
                viewMode.style.display = 'none';
                editModeForm.style.display = 'none';
                emailForm.style.display = 'none';

                try {
                    const doc = await db.collection('couples').doc(coupleId).collection('cards').doc(currentCardId).get();
                    if (!doc.exists) return;
                    const cardData = doc.data();

                    if (cardData.title) {
                        viewMode.style.display = 'block';
                        modalTitle.textContent = cardData.title;
                        modalDescription.textContent = cardData.description;
                        modalImage.src = cardData.imageUrl || 'https://placehold.co/320x220/215a6d/FDFAF7?text=Sem+Imagem';
                    } else {
                        editModeForm.style.display = 'block';
                        ideaTitleInput.value = '';
                        ideaDescriptionInput.value = '';
                        imagePreview.style.display = 'none';
                        imagePreviewText.style.display = 'block';
                        imagePreview.src = '';
                        imageUpload.value = '';
                    }
                    modal.classList.add('visivel');
                } catch (error) {
                    console.error("Erro ao carregar dados do cartão:", error);
                }
            }

            function closeModal() {
                modal.classList.remove('visivel');
                currentCardId = null;
            }

    async function handleSaveIdea(e) {
    e.preventDefault();
    const submitButton = editModeForm.querySelector('button[type="submit"]');
    // Se você estiver a usar o spinner, não precisa mudar o texto do botão aqui.
    // submitButton.textContent = 'A Salvar...'; 
    submitButton.disabled = true;

    // Recomendo usar o spinner que implementamos para um melhor feedback visual
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'flex';

    try {
        // 1. Criamos um único objeto para os dados que vamos salvar.
        // Começa com o título e a descrição que sempre existem.
        const dataToSave = {
            title: ideaTitleInput.value,
            description: ideaDescriptionInput.value,
        };

        const file = imageUpload.files[0];

   
        if (file) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
                maxIteration: 10,
                exifOrientation: 1,
                fileType: "image/webp",
                initialQuality: 0.9,
            };

            console.log(`Imagem original: ${file.name}, tamanho: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
            
            const compressedFile = await imageCompression(file, options);
            console.log(`Imagem comprimida: ${compressedFile.name}, tamanho: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

            const filePath = `cards/${currentCardId}/${Date.now()}_${compressedFile.name}`;
            const fileRef = storage.ref(filePath);
            const snapshot = await fileRef.put(compressedFile);
            
            // 3. Obtemos a URL e a adicionamos ao nosso objeto `dataToSave`.
            const imageUrl = await snapshot.ref.getDownloadURL();
            dataToSave.imageUrl = imageUrl; 
        }

        // 4. Salvamos o objeto `dataToSave` no Firestore.
        // Ele conterá o título e a descrição, e a imageUrl SE uma imagem foi processada.
        await db.collection('couples').doc(coupleId).collection('cards').doc(currentCardId).set(dataToSave, { merge: true });
        
        closeModal();

    } catch (error) {
        console.error("Erro ao salvar ideia: ", error);
        alert("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
        submitButton.textContent = 'Salvar Ideia';
        submitButton.disabled = false;
        if (spinner) spinner.style.display = 'none';
    }
}
            async function handleSendEmail(e) {
    e.preventDefault();
    const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbzK479spWFVZrQtbVYqF3VUTr3gKrKwXBstO7pPTVXnZlvqDZ_nNjTG26LQlXFNLhUPsQ/exec'; // <-- VAI PRECISAR DE ATUALIZAR ESTA URL
    const seuEmail = "valentinawpp25@gmail.com";
    const emailDela = "qpanaclara@gmail.com";

    // ... (as suas validações continuam iguais)
    if (!dateInput.value) {
        alert("Por favor, preencha a data sugerida.");
        return;
    }

    const emailData = {
        seuEmail: seuEmail,
        emailDela: emailDela,
        tituloPresente: modalTitle.textContent,
        ideiaDatePresente: modalDescription.textContent, // Corrigi o nome da variável para consistência
        dataEscolhida: dateInput.value,
        observacao: observationInput.value,
    };

    submitEmailBtn.disabled = true;
    submitEmailBtn.textContent = 'A Enviar...';

    try {
        const response = await fetch(urlDoSeuGoogleAppsScript, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Alterado para o tipo correto.
            },
            body: JSON.stringify(emailData),
        });

        // O 'fetch' não gera erro para respostas 4xx/5xx, então verificamos manualmente.
        if (!response.ok) {
            throw new Error(`O servidor respondeu com um erro: ${response.statusText}`);
        }

        const result = await response.json(); // Esperamos uma resposta JSON do script

        if (result.status === "success") {
            alert(`Ideia "${emailData.tituloPresente}" enviada com sucesso!`);
        } else {
            throw new Error(result.message || "Ocorreu um erro desconhecido no script.");
        }
        
    } catch (error) {
        console.error('Erro ao tentar enviar e-mail:', error);
        alert('Ocorreu um erro ao enviar a notificação. Verifique a consola para mais detalhes.');
    } finally {
        submitEmailBtn.disabled = false;
        submitEmailBtn.textContent = 'Confirmar Envio';
        closeModal();
    }
}

            // --- EVENT LISTENERS ---
            addCardBtn.addEventListener('click', addNewCard);
            closeModalBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
            editModeForm.addEventListener('submit', handleSaveIdea);
            submitEmailBtn.addEventListener('click', handleSendEmail);

            giftCardContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.cartaoPresente');
                if (!card) return;

                if (e.target.classList.contains('botaoVerDetalhesPresente')) {
                    openModal(card);
                } else if (e.target.classList.contains('botaoDeletarCard')) {
                    deleteCard(card.dataset.id);
                }
            });

            editBtn.addEventListener('click', () => {
                const currentTitle = modalTitle.textContent;
                const currentDescription = modalDescription.textContent;
                const currentImageSrc = modalImage.src;

                viewMode.style.display = 'none';
                emailForm.style.display = 'none';

                ideaTitleInput.value = currentTitle;
                ideaDescriptionInput.value = currentDescription;
                
                if (currentImageSrc && !currentImageSrc.includes('placehold.co')) {
                    imagePreview.src = currentImageSrc;
                    imagePreview.style.display = 'block';
                    imagePreviewText.style.display = 'none';
                } else {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                    imagePreviewText.style.display = 'block';
                }
                imageUpload.value = '';

                editModeForm.style.display = 'block';
            });

            imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        imagePreview.src = event.target.result;
                        imagePreview.style.display = 'block';
                        imagePreviewText.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            });

            sendEmailBtn.addEventListener('click', () => {
                viewMode.style.display = 'none';
                emailForm.style.display = 'block';
            });

            // --- INICIALIZAÇÃO ---
            loadCards();
        });