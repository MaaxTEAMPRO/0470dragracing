document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const saveConfigButton = document.getElementById("saveConfig");
    const startRaceButton = document.getElementById("startRace");
    const burnoutButton = document.getElementById("burnoutButton");
    const launchButton = document.getElementById("launchButton");
    const restartRaceButton = document.getElementById("restartRace");
    const car = document.getElementById("car");
    const reactionTimeEl = document.getElementById("reactionTime");
    const totalTimeEl = document.getElementById("totalTime");
    
    // Game variables
    let boost = 0.5;
    let power = 5;
    let suspensionFront = 5;
    let suspensionRear = 5;
    let reactionTime = 0;
    let totalTime = 0;
    let carPosition = 0;
    let burnoutReady = false;

    const trackLength = 1500;

    // Save configuration
    saveConfigButton.addEventListener("click", () => {
        boost = document.getElementById("boost").value / 100;
        power = document.getElementById("power").value / 10;
        suspensionFront = document.getElementById("suspensionFront").value / 10;
        suspensionRear = document.getElementById("suspensionRear").value / 10;
        alert("Configuration Saved!");
    });

    // Start race
    startRaceButton.addEventListener("click", () => {
        document.getElementById("menu").style.display = "none";
        document.getElementById("race").style.display = "block";
        resetRace();
    });

    // Burnout system
    burnoutButton.addEventListener("click", () => {
        burnoutReady = true;
        launchButton.disabled = false;
        alert("Burnout Ready! Launch Enabled.");
    });

    // Launch system
    launchButton.addEventListener("click", () => {
        const start = performance.now();
        const interval = setInterval(() => {
            carPosition += power * (1 + boost);
            car.style.left = `${carPosition}px`;

            if (carPosition >= trackLength) {
                clearInterval(interval);
                totalTime = performance.now() - start;
                totalTimeEl.textContent = `Total: ${totalTime.toFixed(2)}ms`;
                alert("Race Complete!");
            }
        }, 16);
    });

    // Restart race
    restartRaceButton.addEventListener("click", resetRace);

    // Reset race
    function resetRace() {
        car.style.left = "0";
        carPosition = 0;
        totalTime = 0;
        reactionTime = 0;
        reactionTimeEl.textContent = "Reaction: 0ms";
        totalTimeEl.textContent = "Total: 0ms";
        burnoutReady = false;
        launchButton.disabled = true;
    }
});