const firebaseConfig = {
            apiKey: "AIzaSyA-HLW_FtlM6Jofs-FkhqFlOIKRsx4aKH0",
            authDomain: "aniversario-clara.firebaseapp.com",
            projectId: "aniversario-clara",
            storageBucket: "aniversario-clara.appspot.com",
            messagingSenderId: "130866696549",
            appId: "1:130866696549:web:4b08ba23f681d64d21d18c"
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
                submitButton.textContent = 'A Salvar...';
                submitButton.disabled = true;

                const title = ideaTitleInput.value;
                const description = ideaDescriptionInput.value;
                const file = imageUpload.files[0];
                
                try {
                    let updateData = { title, description };

                    if (file) {
                        const filePath = `cards/${currentCardId}/${file.name}`;
                        const fileRef = storage.ref(filePath);
                        const snapshot = await fileRef.put(file);
                        updateData.imageUrl = await snapshot.ref.getDownloadURL();
                    }
                    
                    await db.collection('couples').doc(coupleId).collection('cards').doc(currentCardId).set(updateData, { merge: true });
                    
                    closeModal();
                } catch (error) {
                    console.error("Erro ao salvar ideia: ", error);
                    alert("Ocorreu um erro ao salvar. Tente novamente.");
                } finally {
                    submitButton.textContent = 'Salvar Ideia';
                    submitButton.disabled = false;
                }
            }

            function handleSendEmail(e) {
                e.preventDefault();
                const urlDoSeuGoogleAppsScript = 'https://script.google.com/macros/s/AKfycbxpZ5czO3YSVx284PkSBmeA3Pxfes3-MvsAXJPAh9nPwpbFGsxWb-DVdHRgvcyJtv0fhw/exec';
                const seuEmail = "valentinawpp25@gmail.com";
                const emailDela = "qpanaclara@gmail.com"; 

                if (urlDoSeuGoogleAppsScript.includes('AKfycb') && (seuEmail === "valentinawpp25@gmail.com" || emailDela === "qpanaclara@gmail.com")) {
                    alert('Por favor, configure seu e-mail e o e-mail de destino no código JavaScript.');
                    return;
                }

                const data = dateInput.value;
                if (!data) {
                    alert("Por favor, preencha a data sugerida.");
                    return;
                }

                const emailData = {
                    seuEmail: seuEmail,
                    emailDela: emailDela,
                    tituloPresente: modalTitle.textContent,
                    ideiaDatePresente: modalDescription.textContent,
                    dataEscolhida: data,
                    observacao: observationInput.value,
                };
                
                submitEmailBtn.disabled = true;
                submitEmailBtn.textContent = 'A Enviar...';

                fetch(urlDoSeuGoogleAppsScript, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(emailData)
                })
                .then(() => {
                    alert(`Ideia "${emailData.tituloPresente}" enviada com sucesso!`);
                })
                .catch(error => {
                    console.error('Erro ao tentar enviar e-mail:', error);
                    alert('Ocorreu um erro de rede ao tentar enviar a notificação.');
                })
                .finally(() => {
                    submitEmailBtn.disabled = false;
                    submitEmailBtn.textContent = 'Confirmar Envio';
                    closeModal(); // **CORREÇÃO:** Fecha o modal aqui, garantindo que ele sempre feche.
                });
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