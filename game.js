document.addEventListener("DOMContentLoaded", () => {
    // Seleção de Elementos DOM
    const saveConfigButton = document.getElementById("saveConfig");
    const startRaceButton = document.getElementById("startRace");
    const burnoutButton = document.getElementById("burnoutButton");
    const launchButton = document.getElementById("launchButton");
    const car = document.getElementById("car");
    const boostInput = document.getElementById("boost");
    const powerInput = document.getElementById("power");
    const suspensionFrontInput = document.getElementById("suspensionFront");
    const suspensionRearInput = document.getElementById("suspensionRear");
    const vehicleSelect = document.getElementById("vehicle");
    const speedDisplay = document.getElementById("speed");
    const rpmDisplay = document.getElementById("rpm");
    const boostDisplay = document.getElementById("boostLevel");
    const menu = document.getElementById("menu");
    const race = document.getElementById("race");

    // Configurações do Carro
    let boost = 0; // 0 a 1
    let power = 5; // 1 a 10
    let suspensionFront = 0.5; // 0 a 1
    let suspensionRear = 0.5; // 0 a 1
    let selectedVehicle = "🚗";
    let carSpeed = 0; // Velocidade atual
    let carRPM = 0; // RPM atual
    let maxRPM = 7000;

    // Estados de Jogo
    let burnoutActive = false;
    let burnoutSuccess = false;
    let raceStarted = false;
    let startTime = 0;

    // Salvar Configurações
    saveConfigButton.addEventListener("click", () => {
        boost = parseInt(boostInput.value) / 100;
        power = parseInt(powerInput.value);
        suspensionFront = parseInt(suspensionFrontInput.value) / 100;
        suspensionRear = parseInt(suspensionRearInput.value) / 100;
        selectedVehicle = vehicleSelect.value;
        alert("Configurações salvas com sucesso!");
    });

    // Começar Corrida
    startRaceButton.addEventListener("click", () => {
        menu.style.display = "none";
        race.style.display = "block";
        resetRace();
    });

    // Lógica do Burnout
    burnoutButton.addEventListener("click", () => {
        if (burnoutActive) return;
        burnoutActive = true;
        let burnoutTimer = 0;
        car.style.animation = "shake 0.2s infinite";

        const burnoutInterval = setInterval(() => {
            burnoutTimer += 100;
            carRPM = Math.min(maxRPM, carRPM + 500); // Aumenta RPM
            rpmDisplay.textContent = carRPM;
            boostDisplay.textContent = Math.round(boost * 100);

            if (burnoutTimer >= 3000) {
                clearInterval(burnoutInterval);
                car.style.animation = "";
                burnoutActive = false;
                burnoutSuccess = true;
                alert("Burnout perfeito!");
            }
        }, 100);
    });

    // Largar
    launchButton.addEventListener("click", () => {
        if (raceStarted) return;
        if (!burnoutSuccess) {
            alert("Sem burnout! Penalidade aplicada.");
            carSpeed -= 10; // Penalidade de velocidade
        }

        raceStarted = true;
        startTime = performance.now();
        moveCar();
    });

    // Mover Carro
    const moveCar = () => {
        const acceleration = power * (1 + boost); // Baseado no power e boost
        const suspensionEffect = Math.abs(suspensionFront - suspensionRear); // Diferença de suspensão afeta estabilidade
        const baseSpeed = 50 + acceleration * 10 - suspensionEffect * 10;

        const raceInterval = setInterval(() => {
            carSpeed = Math.min(baseSpeed, carSpeed + acceleration); // Incrementa velocidade
            carRPM = Math.min(maxRPM, carRPM + acceleration * 200); // Incrementa RPM

            // Atualizações de UI
            speedDisplay.textContent = Math.round(carSpeed);
            rpmDisplay.textContent = Math.round(carRPM);

            // Movimento do carro
            const progress = (carSpeed / baseSpeed) * 100;
            car.style.left = `${Math.min(progress, 100)}%`;

            // Fim da Corrida
            if (progress >= 100) {
                clearInterval(raceInterval);
                carSpeed = 0;
                carRPM = 0;
                alert("Corrida concluída!");
            }
        }, 100);
    };

    // Resetar Corrida
    const resetRace = () => {
        burnoutActive = false;
        burnoutSuccess = false;
        raceStarted = false;
        carSpeed = 0;
        carRPM = 0;
        car.style.left = "0%";
        rpmDisplay.textContent = "0";
        speedDisplay.textContent = "0";
        boostDisplay.textContent = Math.round(boost * 100);
    };
});