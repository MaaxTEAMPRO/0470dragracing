document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
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

    // Configurações do carro
    let boost = 0;  // Nível de boost (0 a 1)
    let power = 5;  // Potência (downforce) (0 a 10)
    let suspensionFront = 0.5;  // Suspensão dianteira (0 a 1)
    let suspensionRear = 0.5;  // Suspensão traseira (0 a 1)
    let selectedVehicle = "🚗";  // Veículo selecionado

    // Estado da corrida
    let burnoutActive = false;
    let reactionStartTime = 0;
    let raceStartTime = 0;
    let penaltyTime = 0;
    let speed = 0;
    let carPosition = { x: 0, y: 0, z: 0 };  // Posição do carro (horizontal, vertical, altura)
    let carRotation = 0;  // Ângulo de rotação do carro (para simular derrapagem)
    const trackLength = 1500;  // Comprimento da pista (aumentado para gerar um tempo maior)

    // Salvar configurações
    saveConfigButton.addEventListener("click", () => {
        boost = parseInt(document.getElementById("boost").value) / 100;
        power = parseInt(document.getElementById("power").value) / 10;
        suspensionFront = parseInt(document.getElementById("suspensionFront").value) / 10;
        suspensionRear = parseInt(document.getElementById("suspensionRear").value) / 10;
        selectedVehicle = vehicleSelect.value;
        alert("Configurações salvas!");
    });

    // Começar corrida
    startRaceButton.addEventListener("click", () => {
        resetRace();  // Resetar antes de começar a corrida
        menu.style.display = "none";
        race.style.display = "block";
        car.textContent = selectedVehicle;
        startBurnout();
    });

    // Voltar ao menu
    backToMenuButton.addEventListener("click", () => {
        menu.style.display = "block";
        race.style.display = "none";
        resetRace();
    });

    // Reiniciar a corrida
    restartRaceButton.addEventListener("click", () => {
        resetRace();
        startBurnout();
    });

    // Lógica do burnout
    const startBurnout = () => {
        burnoutActive = false;
        burnoutBar.style.width = "0%";
        targetZone.style.left = "40%";
        targetZone.style.width = "20%";
        launchButton.disabled = true;
        accelerateButton.style.display = "inline-block";

        accelerateButton.addEventListener("mousedown", () => {
            burnoutActive = true;
            car.style.animation = "shake 0.1s infinite"; // Trepidação
            handleBurnout();
        });

        accelerateButton.addEventListener("mouseup", () => {
            burnoutActive = false;
            car.style.animation = ""; // Parar trepidação
            evaluateBurnout();
        });
    };

    const handleBurnout = () => {
        if (!burnoutActive) return;
        let width = parseFloat(burnoutBar.style.width || "0");
        if (width < 100) {
            width += 2;
            burnoutBar.style.width = `${width}%`;
            setTimeout(handleBurnout, 100); // Continuar preenchendo a barra
        }
    };

    const evaluateBurnout = () => {
        const width = parseFloat(burnoutBar.style.width || "0");
        const targetStart = parseFloat(targetZone.style.left);
        const targetEnd = targetStart + parseFloat(targetZone.style.width);

        if (width >= targetStart && width <= targetEnd) {
            console.log("Burnout perfeito!");
            penaltyTime = 0;
        } else {
            console.log("Burnout falhou!");
            penaltyTime = 1000; // 1 segundo de penalidade
        }

        burnoutBar.style.width = "0%";
        accelerateButton.style.display = "none";
        startPinheirinho();
    };

    // Lógica do pinheirinho (semáforo)
    const startPinheirinho = () => {
        let delay = 0;
        reactionStartTime = 0;

        lights.forEach((light, index) => {
            setTimeout(() => {
                light.classList.add("active");
                if (index === lights.length - 1) {
                    setTimeout(() => {
                        lights.forEach((light) => light.classList.remove("active"));
                        lights.forEach((light) => light.classList.add("ready"));
                        launchButton.disabled = false;
                        reactionStartTime = performance.now();
                    }, 1000);
                }
            }, delay);
            delay += 1000;
        });
    };

    // Largar
    launchButton.addEventListener("click", () => {
        if (reactionStartTime === 0) return;

        const reactionTime = performance.now() - reactionStartTime;
        reactionTimeEl.textContent = reactionTime.toFixed(2);
        raceStartTime = performance.now();

        launchButton.disabled = true;
        lights.forEach((light) => light.classList.remove("ready"));
        moveCar(reactionTime);
    });

    // Mover o carro
    const moveCar = (reactionTime) => {
        const speedMultiplier = power * (1 + boost); // Acelerando com base no power e boost
        const travelTime = (trackLength / speedMultiplier) * 10; // Ajuste do tempo baseado no speedMultiplier

        // Simulando o movimento do carro com a derrapagem e a física
        car.style.transition = `left ${travelTime / 1000}s linear, transform ${travelTime / 1000}s ease-in-out`;
        car.style.left = "100%";  // Mover o carro para a linha de chegada

        setTimeout(() => {
            const totalTime = reactionTime + travelTime + penaltyTime;
            totalTimeEl.textContent = totalTime.toFixed(2);
        }, travelTime);
    };

    // Função para aplicar a física de derrapagem
    const applyPhysics = () => {
        // Simula a derrapagem e movimento vertical do carro
        if (Math.random() < 0.05) { // Probabilidade de derrapagem
            carPosition.y += Math.sin(carRotation) * 5;  // Movimento vertical devido à derrapagem
            carPosition.z = Math.sin(carRotation) * 2;  // Mais movimentação vertical com rotação
        }

        // Limita a posição na pista
        if (carPosition.x >= trackLength) {
            carPosition.x = trackLength;
        }
    };

    // Resetar a corrida
    const resetRace = () => {
        burnoutBar.style.width = "0%";
        lights.forEach((light) => {
            light.classList.remove("active");
            light.classList.remove("ready");
        });
        car.style.left = "0";  // Voltar o carro para a posição inicial
        car.style.transition = "none";
        reactionTimeEl.textContent = "0";
        totalTimeEl.textContent = "0";
        penaltyTime = 0;
    };

    // Função para printar o resultado
    printResultButton.addEventListener("click", () => {
        const reactionTime = reactionTimeEl.textContent;
        const totalTime = totalTimeEl.textContent;
        const vehicle = selectedVehicle;
        const currentTime = new Date().toLocaleString();

        // Cria um canvas para desenhar o resultado
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Define o tamanho do canvas
        canvas.width = 400;
        canvas.height = 300;

        // Desenha o fundo
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Define a cor e fonte do texto
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";

        // Desenha os dados na tela
        ctx.fillText("Resultado da Corrida", 120, 30);
        ctx.fillText(`Veículo: ${selectedVehicle}`, 120, 60);
        ctx.fillText(`Tempo de Reação: ${reactionTimeEl.textContent}`, 120, 90);
        ctx.fillText(`Tempo Total: ${totalTimeEl.textContent}`, 120, 120);
        ctx.fillText(`Data: ${currentTime}`, 120, 150);

        // Exibir o canvas como imagem
        const resultImage = new Image();
        resultImage.src = canvas.toDataURL("image/png");
        resultImage.onload = () => {
            const windowResult = window.open("", "_blank");
            windowResult.document.write('<img src="' + resultImage.src + '" />');
        };
    };

    // Inicializa o jogo (não aparece até que a corrida seja iniciada)
    resetRace();
});