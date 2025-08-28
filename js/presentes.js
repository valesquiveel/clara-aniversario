const firebaseConfig = {
            apiKey: "SUA_API_KEY",
            authDomain: "SEU_AUTH_DOMAIN",
            projectId: "SEU_PROJECT_ID",
            storageBucket: "SEU_STORAGE_BUCKET",
            messagingSenderId: "SEU_MESSAGING_SENDER_ID",
            appId: "SEU_APP_ID"
        };
        // ===================================================================

        // Inicializa o Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
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
            let coupleId = "casal_unico_id"; // ID compartilhado para vocês dois

            // --- LÓGICA DE DADOS (Firebase) ---
            function loadCards() {
                db.collection('couples').doc(coupleId).collection('cards').onSnapshot(snapshot => {
                    giftCardContainer.innerHTML = '';
                    if (snapshot.empty) {
                        // Adiciona 3 cartões iniciais se não houver nenhum
                        addNewCard(); addNewCard(); addNewCard();
                    } else {
                        snapshot.forEach(doc => {
                            const cardData = doc.data();
                            const cardElement = createCardElement(doc.id, cardData);
                            giftCardContainer.appendChild(cardElement);
                        });
                    }
                });
            }

    function createCardElement(data) {
        const card = document.createElement('div');
        card.className = 'cartaoPresente';
        card.dataset.id = data.id;

        const imageUrl = data.imageUrl || 'https://placehold.co/220x160/215a6d/FDFAF7?text=Nova+Ideia';
        const title = data.title || 'Um Momento Só Nosso';
        const description = data.description ? (data.description.substring(0, 50) + '...') : 'Crie aqui a sua ideia de presente!';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${title}" class="cartaoPresenteImagem">
            <h3 class="cartaoPresenteTitulo">${title}</h3>
            <p class="cartaoPresenteDescCurta">${description}</p>
            <button class="botaoVerDetalhesPresente">Ver Detalhes</button>
        `;
        return card;
    }

    function addNewCard(save = true) {
        const newCard = {
            id: 'card-' + Date.now() + Math.random(),
            title: '',
            description: '',
            imageUrl: ''
        };
        cardsData.push(newCard);
        
        if (save) {
            saveDataToStorage();
            renderAllCards();
        }
    }

    function openModal(cardElement) {
        currentCardId = cardElement.dataset.id;
        const cardData = cardsData.find(card => card.id === currentCardId);
        if (!cardData) return;

        viewMode.style.display = 'none';
        editModeForm.style.display = 'none';
        emailForm.style.display = 'none';

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
    }

    function closeModal() {
        modal.classList.remove('visivel');
        currentCardId = null;
    }

    function handleSaveIdea(e) {
        e.preventDefault();
        const cardIndex = cardsData.findIndex(card => card.id === currentCardId);
        if (cardIndex === -1) return;

        const cardToUpdate = cardsData[cardIndex];
        cardToUpdate.title = ideaTitleInput.value;
        cardToUpdate.description = ideaDescriptionInput.value;
        
        const file = imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                cardToUpdate.imageUrl = event.target.result;
                saveDataToStorage();
                renderAllCards();
                closeModal();
            };
            reader.readAsDataURL(file);
        } else {
            saveDataToStorage();
            renderAllCards();
            closeModal();
        }
    }

    function handleSendEmail(e) {
        e.preventDefault();
        
        const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbxpZ5czO3YSVx284PkSBmeA3Pxfes3-MvsAXJPAh9nPwpbFGsxWb-DVdHRgvcyJtv0fhw/exec';
        const seuEmail = "seu-email@exemplo.com";
        const emailDela = "email-dela@exemplo.com"; 
    
        if (urlDoSeuGoogleAppsScript.includes('AKfycb') && (seuEmail === "seu-email@exemplo.com" || emailDela === "email-dela@exemplo.com")) {
            alert('Por favor, configure seu e-mail e o e-mail de destino no código JavaScript.');
            return;
        }

        const cardData = cardsData.find(card => card.id === currentCardId);
        if (!cardData) return;

        if (!dateInput.value) {
            alert("Por favor, preencha a data sugerida.");
            return;
        }

        const emailData = {
            seuEmail: seuEmail,
            emailDela: emailDela,
            tituloPresente: cardData.title,
            ideiaDatePresente: cardData.description,
            dataEscolhida: dateInput.value,
            observacao: observationInput.value,
        };
        
        submitEmailBtn.disabled = true;
        submitEmailBtn.textContent = 'A Enviar...';

        fetch(urlDoSeuGoogleAppsScript, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        })
        .then(() => {
            alert(`Ideia "${cardData.title}" enviada com sucesso!`);
            closeModal();
        })
        .catch(error => {
            console.error('Erro ao tentar enviar e-mail:', error);
            alert('Ocorreu um erro de rede ao tentar enviar a notificação. Verifique o console para mais detalhes.');
        })
        .finally(() => {
            submitEmailBtn.disabled = false;
            submitEmailBtn.textContent = 'Confirmar Envio';
        });
    }

    addCardBtn.addEventListener('click', () => addNewCard());

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal();
    });

    editModeForm.addEventListener('submit', handleSaveIdea);

    submitEmailBtn.addEventListener('click', handleSendEmail);

    giftCardContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('botaoVerDetalhesPresente')) {
            const card = e.target.closest('.cartaoPresente');
            if (card) openModal(card);
        }
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
    
    imagePreviewContainer.addEventListener('click', () => imageUpload.click());

    sendEmailBtn.addEventListener('click', () => {
        viewMode.style.display = 'none';
        emailForm.style.display = 'block';
    });

    loadDataFromStorage();
    renderAllCards();
});