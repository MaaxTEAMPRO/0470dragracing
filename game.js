document.addEventListener("DOMContentLoaded", () => {
    const saveConfigButton = document.getElementById("saveConfig");
    const startRaceButton = document.getElementById("startRace");
    const backToMenuButton = document.getElementById("backToMenu");
    const accelerateButton = document.getElementById("accelerateButton");
    const launchButton = document.getElementById("launchButton");
    const burnoutBar = document.getElementById("burnoutBar");
    const targetZone = document.getElementById("targetZone");
    const lights = document.querySelectorAll(".light");
    const car = document.getElementById("car");
    const reactionTimeEl = document.getElementById("reactionTime");
    const totalTimeEl = document.getElementById("totalTime");
    const menu = document.getElementById("menu");
    const race = document.getElementById("race");
    const vehicleSelect = document.getElementById("vehicle");
    const printResultButton = document.getElementById("printResult");
    const restartRaceButton = document.getElementById("restartRace");

    let boost = 0;
    let power = 5;
    let suspensionFront = 0.5;
    let suspensionRear = 0.5;
    let selectedVehicle = "🚗";

    let burnoutActive = false;
    let reactionStartTime = 0;
    let raceStartTime = 0;
    let penaltyTime = 0;
    let speed = 0;
    let carPosition = { x: 0, y: 0, z: 0 };
    let carRotation = 0;
    const trackLength = 1500;

    saveConfigButton.addEventListener("click", () => {
        boost = parseInt(document.getElementById("boost").value) / 100;
        power = parseInt(document.getElementById("power").value) / 10;
        suspensionFront = parseInt(document.getElementById("suspensionFront").value) / 10;
        suspensionRear = parseInt(document.getElementById("suspensionRear").value) / 10;
        selectedVehicle = vehicleSelect.value;
        alert("Configurações salvas!");
    });

    startRaceButton.addEventListener("click", () => {
        resetRace();
        menu.style.display = "none";
        race.style.display = "block";
        car.textContent = selectedVehicle;
        startBurnout();
    });

    backToMenuButton.addEventListener("click",