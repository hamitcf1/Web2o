class RockPaperScissors {
    constructor() {
        this.storageKey = 'rpsGameState-v2';
        this.scores = {
            player: 0,
            computer: 0,
            ties: 0
        };
        this.history = [];
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.setupEventListeners();
        this.loadGameState();
    }

    setupEventListeners() {
        document.querySelectorAll('.choice').forEach(button => {
            button.addEventListener('click', () => this.handleChoice(button.dataset.choice));
        });

        document.getElementById('reset').addEventListener('click', () => this.resetGame());
        document.getElementById('autoplay').addEventListener('click', () => this.toggleAutoPlay());
    }

    handleChoice(playerChoice) {
        if (this.isAutoPlaying) return;

        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        
        this.animateChoice(playerChoice, computerChoice);
        this.updateGame(playerChoice, computerChoice);
    }

    animateChoice(playerChoice, computerChoice) {
        const choices = document.querySelectorAll('.choice');
        choices.forEach(choice => {
            if (choice.dataset.choice === playerChoice) {
                choice.classList.add('selected');
                setTimeout(() => choice.classList.remove('selected'), 500);
            }
        });
    }

    updateGame(playerChoice, computerChoice) {
        const result = this.getResult(playerChoice, computerChoice);
        this.updateScores(result);
        this.addToHistory(playerChoice, computerChoice, result);
        this.displayResult(result, playerChoice, computerChoice);
        this.saveGameState();
    }

    getResult(player, computer) {
        if (player === computer) return 'tie';
        const wins = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        return wins[player] === computer ? 'win' : 'lose';
    }

    updateScores(result) {
        if (result === 'win') this.scores.player++;
        else if (result === 'lose') this.scores.computer++;
        else this.scores.ties++;

        document.getElementById('player-score').textContent = this.scores.player;
        document.getElementById('computer-score').textContent = this.scores.computer;
        document.getElementById('tie-score').textContent = this.scores.ties;
    }

    addToHistory(playerChoice, computerChoice, result) {
        const historyItem = {
            playerChoice,
            computerChoice,
            result,
            timestamp: new Date().toISOString()
        };
        this.history.unshift(historyItem);
        if (this.history.length > 10) this.history.pop();
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <span>You chose ${item.playerChoice} vs Computer's ${item.computerChoice}</span>
                <span class="result-${item.result}">
                    ${item.result.toUpperCase()}
                </span>
            </div>
        `).join('');
    }

    displayResult(result, playerChoice, computerChoice) {
        const resultDiv = document.getElementById('result');
        const messages = {
            win: `You win! ${playerChoice} beats ${computerChoice}`,
            lose: `You lose! ${computerChoice} beats ${playerChoice}`,
            tie: `It's a tie! Both chose ${playerChoice}`
        };
        resultDiv.textContent = messages[result];
        resultDiv.className = `result ${result}`;
        this.showToast(messages[result], result);
    }

    showToast(message, type) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.scores = { player: 0, computer: 0, ties: 0 };
            this.history = [];
            // Directly update the score displays to reflect reset
            document.getElementById('player-score').textContent = this.scores.player;
            document.getElementById('computer-score').textContent = this.scores.computer;
            document.getElementById('tie-score').textContent = this.scores.ties;
            this.renderHistory();
            document.getElementById('result').textContent = 'Choose your weapon!';
            document.getElementById('result').className = 'result';
            if (this.isAutoPlaying) this.toggleAutoPlay();
            this.saveGameState();
            this.showToast('Game reset!', 'info');
        }
    }

    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        const autoPlayBtn = document.getElementById('autoplay');
        const icon = autoPlayBtn.querySelector('i');
        
        if (this.isAutoPlaying) {
            autoPlayBtn.textContent = 'Stop Auto Play';
            autoPlayBtn.insertBefore(icon, autoPlayBtn.firstChild);
            icon.className = 'fas fa-stop';
            this.autoPlayInterval = setInterval(() => {
                const choices = ['rock', 'paper', 'scissors'];
                const randomChoice = choices[Math.floor(Math.random() * 3)];
                this.handleChoice(randomChoice);
            }, 1500);
        } else {
            autoPlayBtn.textContent = 'Auto Play';
            autoPlayBtn.insertBefore(icon, autoPlayBtn.firstChild);
            icon.className = 'fas fa-play';
            clearInterval(this.autoPlayInterval);
        }
    }

    saveGameState() {
        const gameState = {
            scores: this.scores,
            history: this.history,
            version: 2
        };
        localStorage.setItem(this.storageKey, JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem(this.storageKey);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            if (gameState.version === 2) {
                this.scores = gameState.scores;
                this.history = gameState.history;
                this.updateScores('tie');
                this.renderHistory();
            } else {
                localStorage.removeItem('rpsGameState');
                localStorage.removeItem(this.storageKey);
            }
        }
    }
}

new RockPaperScissors(); 