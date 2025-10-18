document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const opportunitiesCountSpan = document.getElementById('opportunities-count');
    const resetButton = document.getElementById('reset-button');

    let opportunities = 2;
    let gameEnded = false;
    let selectedPrizeCard = null; 
    let prizes = ['coke', 'discount']; // 'coke' (Coca Cola) o 'discount' (10% de descuento)

    function initializeGame() {
        opportunities = 2;
        gameEnded = false;
        opportunitiesCountSpan.textContent = opportunities;
        resetButton.style.display = 'none';

        // Reiniciar todas las cartas a su estado inicial
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.style.pointerEvents = 'auto'; 
            card.querySelector('.card-front').innerHTML = '<img src="tuki-burger-logo.png" alt="Logo Tuki Burger">'; 
            card.querySelector('.card-front').classList.remove('winner-coke', 'winner-discount', 'loser'); 
        });

        // Asignar aleatoriamente la carta del premio
        const shuffledPrizes = prizes.sort(() => Math.random() - 0.5);
        const winningPrizeType = shuffledPrizes[0]; 

        let randomIndex = Math.floor(Math.random() * cards.length);
        cards.forEach((card, index) => {
            if (index === randomIndex) {
                card.dataset.prize = winningPrizeType; // Asigna el tipo de premio a la carta ganadora
                selectedPrizeCard = card; 
            } else {
                card.dataset.prize = 'false'; // Las demás son perdedoras
            }
        });
    }

    function handleCardClick(event) {
        if (gameEnded) return;

        const clickedCard = event.currentTarget;

        if (clickedCard.classList.contains('flipped')) {
            return;
        }

        opportunities--;
        opportunitiesCountSpan.textContent = opportunities;

        clickedCard.classList.add('flipped');

        cards.forEach(card => card.style.pointerEvents = 'none'); // Deshabilitar clics

        setTimeout(() => { 
            if (clickedCard.dataset.prize !== 'false') {
                // ¡Ha ganado!
                gameEnded = true;
                displayPrizeOnCard(clickedCard, clickedCard.dataset.prize);
                setTimeout(() => {
                    // ¡TEXTO ACTUALIZADO CON EL 10%!
                    alert(`¡Felicidades! Has ganado un/a ${clickedCard.dataset.prize === 'coke' ? 'Coca Cola' : '10% de descuento en una burger'}!`); 
                    showResetButton();
                }, 500);

            } else {
                // Ha fallado
                displayPrizeOnCard(clickedCard, 'loser');
                if (opportunities === 0) {
                    gameEnded = true;
                    setTimeout(() => {
                        alert('Lo siento, te has quedado sin oportunidades. ¡Más suerte la próxima!');
                        showResetButton();
                    }, 500);
                } else {
                    cards.forEach(card => card.style.pointerEvents = 'auto');
                }
            }
            clickedCard.style.pointerEvents = 'none';

        }, 600);
    }

    function displayPrizeOnCard(card, prizeType) {
        const frontFace = card.querySelector('.card-front');
        frontFace.innerHTML = ''; 

        if (prizeType === 'coke') {
            frontFace.classList.add('winner-coke');
            frontFace.innerHTML = '<img src="coca-cola.png" alt="Coca Cola">';
        } else if (prizeType === 'discount') {
            frontFace.classList.add('winner-discount');
            frontFace.innerHTML = '<img src="tuki-burger-logo.png" alt="Logo Tuki Burger">';
        } else { // 'loser'
            frontFace.classList.add('loser');
        }
    }


    function showResetButton() {
        resetButton.style.display = 'block';
    }

    // Añadir eventos a las cartas
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

    // Añadir evento al botón de reinicio
    resetButton.addEventListener('click', initializeGame);

    // Inicializar el juego al cargar la página
    initializeGame();
});
