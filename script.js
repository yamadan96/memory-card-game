document.addEventListener('DOMContentLoaded', () => {
    // ゲームの状態を管理する変数
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let isProcessing = false;
    let moves = 0;
    let timer = 0;
    let timerInterval = null;
    let gameStarted = false;

    // DOM要素
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const restartButton = document.getElementById('restart');

    // カードの種類（トランプの絵柄と数字）
    const cardTypes = [
        '♠A', '♠2', '♠3', '♠4', '♠5', '♠6', '♠7', '♠8', '♠9', '♠10', '♠J', '♠Q', '♠K',
        '♥A', '♥2', '♥3', '♥4', '♥5', '♥6', '♥7', '♥8', '♥9', '♥10', '♥J', '♥Q', '♥K',
        '♦A', '♦2', '♦3', '♦4', '♦5', '♦6', '♦7', '♦8', '♦9', '♦10', '♦J', '♦Q', '♦K',
        '♣A', '♣2', '♣3', '♣4', '♣5', '♣6', '♣7', '♣8', '♣9', '♣10', '♣J', '♣Q', '♣K'
    ];

    // ゲームの初期化
    function initGame() {
        // ゲームの状態をリセット
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        isProcessing = false;
        moves = 0;
        timer = 0;
        gameStarted = false;
        
        // タイマーをクリア
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // 表示をリセット
        movesElement.textContent = '0';
        timerElement.textContent = '0';
        
        // ゲームボードをクリア
        gameBoard.innerHTML = '';
        
        // カードを選択（16枚 = 8ペア）
        const selectedCards = selectRandomCards(8);
        
        // カードをシャッフル
        cards = shuffleCards([...selectedCards, ...selectedCards]);
        
        // カードをゲームボードに配置
        createGameBoard();
    }

    // ランダムにカードを選択する関数
    function selectRandomCards(numPairs) {
        const shuffledTypes = [...cardTypes].sort(() => Math.random() - 0.5);
        return shuffledTypes.slice(0, numPairs);
    }

    // カードをシャッフルする関数
    function shuffleCards(cardArray) {
        return cardArray.sort(() => Math.random() - 0.5);
    }

    // ゲームボードを作成する関数
    function createGameBoard() {
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card}</div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => flipCard(cardElement, index));
            gameBoard.appendChild(cardElement);
        });
    }

    // カードをめくる関数
    function flipCard(cardElement, index) {
        // 処理中、すでにめくられている、またはマッチしているカードはクリックできない
        if (isProcessing || flippedCards.includes(index) || cardElement.classList.contains('matched')) {
            return;
        }
        
        // ゲームが開始されていなければタイマーを開始
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        // カードをめくる
        cardElement.classList.add('flipped');
        flippedCards.push(index);
        
        // 2枚めくられたらマッチングをチェック
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            
            isProcessing = true;
            
            const firstCardIndex = flippedCards[0];
            const secondCardIndex = flippedCards[1];
            
            if (cards[firstCardIndex] === cards[secondCardIndex]) {
                // マッチした場合
                setTimeout(() => {
                    const firstCard = document.querySelector(`.card[data-index="${firstCardIndex}"]`);
                    const secondCard = document.querySelector(`.card[data-index="${secondCardIndex}"]`);
                    
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    
                    matchedPairs++;
                    flippedCards = [];
                    isProcessing = false;
                    
                    // すべてのペアがマッチしたらゲーム終了
                    if (matchedPairs === cards.length / 2) {
                        endGame();
                    }
                }, 500);
            } else {
                // マッチしなかった場合
                setTimeout(() => {
                    const firstCard = document.querySelector(`.card[data-index="${firstCardIndex}"]`);
                    const secondCard = document.querySelector(`.card[data-index="${secondCardIndex}"]`);
                    
                    firstCard.classList.add('shake');
                    secondCard.classList.add('shake');
                    
                    setTimeout(() => {
                        firstCard.classList.remove('flipped', 'shake');
                        secondCard.classList.remove('flipped', 'shake');
                        
                        flippedCards = [];
                        isProcessing = false;
                    }, 500);
                }, 1000);
            }
        }
    }

    // タイマーを開始する関数
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = timer;
        }, 1000);
    }

    // ゲームを終了する関数
    function endGame() {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`おめでとうございます！\n手数: ${moves}回\n時間: ${timer}秒`);
        }, 500);
    }

    // リスタートボタンのイベントリスナー
    restartButton.addEventListener('click', initGame);

    // ゲームを初期化
    initGame();
});
