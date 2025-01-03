class RockPaperScissors {
    constructor() {
        this.choices = ['rock', 'paper', 'scissors'];
        this.playerScore = 0;
        this.computerScore = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.choice').forEach(button => {
            button.addEventListener('click', () => {
                this.playRound(button.dataset.choice);
            });
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.resetGame();
        });
    }

    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    playRound(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);
        
        // Animate choices
        this.animateChoices(playerChoice, computerChoice);
        
        // Update scores and display
        this.updateScore(result);
        this.displayResult(result, playerChoice, computerChoice);
    }

    determineWinner(player, computer) {
        if (player === computer) return 'draw';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[player] === computer ? 'win' : 'lose';
    }

    animateChoices(playerChoice, computerChoice) {
        // Remove previous selections
        document.querySelectorAll('.choice').forEach(btn => {
            btn.classList.remove('selected', 'animated');
        });

        // Add new selections with animation
        const playerButton = document.querySelector(`[data-choice="${playerChoice}"]`);
        const computerButton = document.querySelector(`[data-choice="${computerChoice}"]`);

        playerButton.classList.add('selected', 'animated');
        computerButton.classList.add('selected', 'animated');
    }

    updateScore(result) {
        if (result === 'win') this.playerScore++;
        if (result === 'lose') this.computerScore++;

        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('computer-score').textContent = this.computerScore;
    }

    displayResult(result, playerChoice, computerChoice) {
        const resultDiv = document.getElementById('result');
        const messages = {
            win: `You win! ${playerChoice} beats ${computerChoice}`,
            lose: `You lose! ${computerChoice} beats ${playerChoice}`,
            draw: `It's a draw! Both chose ${playerChoice}`
        };

        resultDiv.textContent = messages[result];
        resultDiv.className = 'result ' + result;
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        document.getElementById('player-score').textContent = '0';
        document.getElementById('computer-score').textContent = '0';
        document.getElementById('result').textContent = 'Choose your weapon!';
        document.getElementById('result').className = 'result';
        document.querySelectorAll('.choice').forEach(btn => {
            btn.classList.remove('selected', 'animated');
        });
    }
}

new RockPaperScissors(); 