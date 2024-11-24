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
  const burnoutBar = document.getElementById("burnoutBar");
  const targetZone = document.getElementById("targetZone");
  const menu = document.getElementById("menu");
  const race = document.getElementById("race");

  // Configurations
  let boost = 1; // Boost multiplier (default)
  let power = 5; // Power multiplier (default)
  let suspensionFront = 0.5; // Suspension height (front)
  let suspensionRear = 0.5; // Suspension height (rear)
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
    suspensionFront = document.getElementById("suspensionFront").value / 10;
    suspensionRear = document.getElementById("suspensionRear").value / 10;
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
    burnoutBar.style.width = "0%";
    targetZone.style.left = "40%";
    targetZone.style.width = "20%";
    accelerateButton.style.display = "block";
    launchButton.style.display = "none";

    let burnoutActive = false;

    const handleAccelerate = () => {
      burnoutActive = true;
      car.style.animation = "shake 0.1s infinite"; // Simulating burnout vibrations

      const increaseBar = () => {
        if (!burnoutActive) return;
        let width = parseFloat(burnoutBar.style.width || "0");
        if (width < 100) {
          width += 5;
          burnoutBar.style.width = `${width}%`;
          setTimeout(increaseBar, 100);
        }
      };

      increaseBar();
    };

    const stopAccelerate = () => {
      burnoutActive = false;
      car.style.animation = "";

      // Evaluate burnout success
      const width = parseFloat(burnoutBar.style.width || "0");
      const targetStart = parseFloat(targetZone.style.left);
      const targetEnd = targetStart + parseFloat(targetZone.style.width);

      if (width >= targetStart && width <= targetEnd) {
        alert("Burnout perfeito!");
        penaltyTime = 0;
      } else {
        alert("Burnout falhou! Penalidade aplicada.");
        penaltyTime = 1000; // 1 second penalty
      }

      accelerateButton.style.display = "none";
      startPinheirinho();
    };

    accelerateButton.addEventListener("mousedown", handleAccelerate);
    accelerateButton.addEventListener("mouseup", stopAccelerate);
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
            launchButton.style.display = "block";
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
    const speedMultiplier = power * (1 + boost);
    const travelTime = trackLength / speedMultiplier;

    car.style.transition = `left ${travelTime}s linear, transform ${travelTime}s ease-in-out`;
    car.style.left = "100%";

    // Suspension and downforce effect
    car.style.transform = `translateY(${5 * (suspensionRear - suspensionFront)}px) scale(${1 + power / 10})`;

    setTimeout(() => {
      const totalTime = reactionTime + travelTime * 1000 + penaltyTime;
      totalTimeEl.textContent = totalTime.toFixed(2);
      alert(`Corrida finalizada! Tempo total: ${totalTime.toFixed(2)}ms`);
    }, travelTime * 1000);
  };

  // Reset race
  const resetRace = () => {
    car.style.left = "0";
    car.style.transition = "none";
    car.style.transform = "none";
    lights.forEach((light) => {
      light.classList.remove("active");
      light.classList.remove("ready");
    });
    reactionTimeEl.textContent = "0";
    totalTimeEl.textContent = "0";
    penaltyTime = 0;
    accelerateButton.style.display = "none";
    launchButton.style.display = "none";
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