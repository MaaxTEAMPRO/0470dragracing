document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
    const saveConfigButton = document.getElementById("saveConfig");
    const startRaceButton = document.getElementById("startRace");
    const burnoutButton = document.getElementById("burnoutButton");
    const launchButton = document.getElementById("launchButton");
    const restartRaceButton = document.getElementById("restartRace");
    const car = document.getElementById("car");
    const reactionTimeEl = document.getElementById("reactionTime");
    const totalTimeEl = document.getElementById("totalTime");

    // Variáveis do Jogo
    let boost = 0.5;
    let power = 5;
    let suspensionFront = 5;
    let suspensionRear = 5;
    let carPosition = 0;
    let reactionStart = 0;
    let trackLength = 1000; // Pista ajustada para experiência fluida
    let burnoutActive = false;

    // Salvar configurações
    saveConfigButton.addEventListener("click", () => {
        boost = document.getElementById("boost").value / 100;
        power = document.getElementById("power").value / 10;
        suspensionFront = document.getElementById("suspensionFront").value / 10;
        suspensionRear = document.getElementById("suspensionRear").value / 10;
        alert("Configurações Salvas!");
    });

    // Iniciar Corrida
    startRaceButton.addEventListener("click", () => {
        document.getElementById("menu").style.display = "none";
        document.getElementById("race").style.display = "block";
        resetRace();
    });

    // Burnout
    burnoutButton.addEventListener("mousedown", () => {
        burnoutActive = true;
        car.style.animation = "shake 0.1s infinite";
    });

    burnoutButton.addEventListener("mouseup", () => {
        burnoutActive = false;
        car.style.animation = "";
        alert("Burnout Completo!");
        launchButton.disabled = false;
    });

    // Largar
    launchButton.addEventListener("click", () => {
        if (!burnoutActive) {
            alert("Você precisa fazer o burnout antes de lançar!");
            return;
        }

        reactionStart = performance.now();
        const interval = setInterval(() => {
            carPosition += power * (1 + boost);
            car.style.left = `${(carPosition / trackLength) * 100}%`;

            if (carPosition >= trackLength) {
                clearInterval(interval);
                const totalTime = performance.now() - reactionStart;
                totalTimeEl.textContent = `Total: ${totalTime.toFixed(2)}ms`;
                alert("Corrida Finalizada!");
            }
        }, 16);
    });

    // Reiniciar Corrida
    restartRaceButton.addEventListener("click", resetRace);

    // Resetar Corrida
    function resetRace() {
        car.style.left = "0";
        carPosition = 0;
        reactionTimeEl.textContent = "Reaction: 0ms";
        totalTimeEl.textContent = "Total: 0ms";
        burnoutActive = false;
        launchButton.disabled = true;
    }
});