document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const saveConfigButton = document.getElementById("saveConfig");
  const startRaceButton = document.getElementById("startRace");
  const backToMenuButton = document.getElementById("backToMenu");
  const restartRaceButton = document.getElementById("restartRace");
  const printResultButton = document.getElementById("printResult");
  const accelerateButton = document.getElementById("accelerateButton");
  const launchButton = document.getElementById("launchButton");
  const car = document.getElementById("car");
  const lights = document.querySelectorAll(".light");
  const reactionTimeEl = document.getElementById("reactionTime");
  const totalTimeEl = document.getElementById("totalTime");
  const menu = document.getElementById("menu");
  const race = document.getElementById("race");

  // Configurations
  let boost = 1; // Boost multiplier (default)
  let power = 5; // Power multiplier (default)
  let selectedVehicle = "🚗"; // Default vehicle
  let burnoutMode = false; // Toggle for burnout

  // Race State
  let reactionStartTime = 0;
  let raceStartTime = 0;
  let penaltyTime = 0;
  const trackLength = 1000; // Track length in arbitrary units

  // Save settings
  saveConfigButton.addEventListener("click", () => {
    boost = document.getElementById("boost").value / 10;
    power = document.getElementById("power").value / 10;
    selectedVehicle = document.getElementById("vehicle").value;
    alert("Configurações salvas!");
  });

  // Start the race
  startRaceButton.addEventListener("click", () => {
    resetRace();
    menu.style.display = "none";
    race.style.display = "block";
    car.textContent = selectedVehicle;
    burnoutMode = confirm("Você deseja realizar um burnout antes da largada?");
    if (burnoutMode) {
      startBurnout();
    } else {
      startPinheirinho();
    }
  });

  // Back to menu
  backToMenuButton.addEventListener("click", () => {
    menu.style.display = "block";
    race.style.display = "none";
    resetRace();
  });

  // Restart race
  restartRaceButton.addEventListener("click", () => {
    resetRace();
    burnoutMode = confirm("Você deseja realizar um burnout antes da largada?");
    if (burnoutMode) {
      startBurnout();
    } else {
      startPinheirinho();
    }
  });

  // Burnout logic
  const startBurnout = () => {
    let burnoutProgress = 0;
    accelerateButton.style.display = "inline-block";
    launchButton.style.display = "none";

    const handleAccelerate = () => {
      burnoutProgress += 5;
      if (burnoutProgress >= 100) {
        burnoutProgress = 100;
        alert("Burnout perfeito! Penalty reduzido.");
        penaltyTime = 0;
        accelerateButton.removeEventListener("mousedown", handleAccelerate);
        accelerateButton.style.display = "none";
        startPinheirinho();
      }
    };

    accelerateButton.addEventListener("mousedown", handleAccelerate);

    // Stop burnout early
    accelerateButton.addEventListener("mouseup", () => {
      if (burnoutProgress < 50) {
        alert("Burnout falhou! Penalty aplicado.");
        penaltyTime = 1000; // 1 second penalty
      }
      accelerateButton.style.display = "none";
      startPinheirinho();
    });
  };

  // Pinheirinho logic
  const startPinheirinho = () => {
    let delay = 0;

    lights.forEach((light, index) => {
      setTimeout(() => {
        light.classList.add("active");
        if (index === lights.length - 1) {
          setTimeout(() => {
            lights.forEach((light) => light.classList.remove("active"));
            lights.forEach((light) => light.classList.add("ready"));
            reactionStartTime = performance.now();
            launchButton.disabled = false;
          }, 1000);
        }
      }, delay);
      delay += 1000;
    });
  };

  // Launch the car
  launchButton.addEventListener("click", () => {
    if (reactionStartTime === 0) return;

    const reactionTime = performance.now() - reactionStartTime;
    reactionTimeEl.textContent = reactionTime.toFixed(2);
    raceStartTime = performance.now();

    launchButton.disabled = true;
    lights.forEach((light) => light.classList.remove("ready"));

    moveCar(reactionTime);
  });

  // Move the car
  const moveCar = (reactionTime) => {
    const speedMultiplier = power * (1 + boost); // Adjusted for power and boost
    const travelTime = trackLength / speedMultiplier; // Calculate travel time

    car.style.transition = `left ${travelTime}s linear`;
    car.style.left = "100%"; // Move car to finish line

    setTimeout(() => {
      const totalTime = reactionTime + travelTime * 1000 + penaltyTime; // Total time calculation
      totalTimeEl.textContent = totalTime.toFixed(2);
      alert(`Corrida finalizada! Tempo total: ${totalTime.toFixed(2)}ms`);
    }, travelTime * 1000);
  };

  // Reset race
  const resetRace = () => {
    car.style.left = "0";
    car.style.transition = "none";
    lights.forEach((light) => {
      light.classList.remove("active");
      light.classList.remove("ready");
    });
    reactionTimeEl.textContent = "0";
    totalTimeEl.textContent = "0";
    penaltyTime = 0;
    accelerateButton.style.display = "none";
    launchButton.disabled = true;
  };

  // Print results
  printResultButton.addEventListener("click", () => {
    const reactionTime = reactionTimeEl.textContent;
    const totalTime = totalTimeEl.textContent;
    const vehicle = selectedVehicle;
    const currentTime = new Date().toLocaleString();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 300;

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    ctx.fillText("Resultado da Corrida", 120, 30);
    ctx.fillText(`Veículo: ${vehicle}`, 20, 70);
    ctx.fillText(`Tempo de Reação: ${reactionTime}ms`, 20, 100);
    ctx.fillText(`Tempo Total: ${totalTime}ms`, 20, 130);
    ctx.fillText(`Horário: ${currentTime}`, 20, 160);

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "resultado_corrida.png";
    link.click();
  });
});