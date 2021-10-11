const canvasWidth = 500;
const canvasHeight = 500;
const animationFramesCount = 100;
let requestAnimationFrameId;
let delayBetweenFrames;
let color = "orange";

window.onload = () => {
  adjustCanvasSize();
  adjustWidths();
  setDelayBetweenFrames();
  addEventHandlers();
  draw();
};

function draw(transformationIndex = -1) {
  const canvas = document.getElementById("canvas");

  if (!canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBorder();
  drawBaseFigure(color, false);

  var then, elapsed;
  let t = 0;

  then = window.performance.now();

  let applyTransformations = () => {};

  if (transformationIndex === 0) {
    applyTransformations = transform_0;
    color = "orange";
  } else if (transformationIndex === 1) {
    applyTransformations = transform_1;
    color = "red";
  } else if (transformationIndex === 2) {
    applyTransformations = transform_2;
    color = "green";
  } else if (transformationIndex === 3) {
    applyTransformations = transform_3;
    color = "blue";
  }

  if (transformationIndex !== -1) {
    animate();
  }

  let moreThanOneCount = 0;

  function animate(currentTime) {
    if (t >= 1 && moreThanOneCount < 10) {
        t = 1;
        moreThanOneCount++;
    } else if(t >= 1 && moreThanOneCount === 10) {
        return;
    }

    requestAnimationFrameId = window.requestAnimationFrame(animate);

    elapsed = currentTime - then;

    if (elapsed > delayBetweenFrames) {
      then = currentTime - (elapsed % delayBetweenFrames);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawBorder();

      ctx.save();
      applyTransformations(t);
      drawBaseFigure(color);

      ctx.restore();

      t += 1 / animationFramesCount;
    }
  }

  function drawBorder() {
    ctx.beginPath();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.closePath();
    ctx.stroke();
  }

  function drawBaseFigure(color) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight * 0.55);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function transform_0(t) {
    ctx.translate(canvasWidth * 0.5 * t, 0);
    ctx.rotate((Math.PI * t) / 2);
    ctx.scale(1 - t / 2, 1 - t / 2);
  }

  function transform_1(t) {
    ctx.translate(canvasWidth * t, 0);
    ctx.scale(1 - t * 1.5, 1 - t / 2);
  }

  function transform_2(t) {
    ctx.translate(canvasWidth * 0.25 * t, canvasHeight * 0.5 * t);
    ctx.rotate(-(Math.PI / 2) * t);
    ctx.scale(3 / 4 - t, 1 - 3 / 4 * t);
    
  }

  function transform_3(t) {
    ctx.translate(canvasWidth * 0.5 * t, canvasHeight * 0.5 * t);
    ctx.scale(1 - t / 2, 1 - t / 2);
  }
}

function adjustCanvasSize() {
  const canvas = document.getElementById("canvas");
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
}

function adjustWidths() {
  const buttons = getTransformationButtons();

  const buttonWidth = canvasWidth / buttons.length;

  for (const button of buttons) {
    button.style.width = buttonWidth;
  }

  const speedSlider = document.getElementById("speed-slider");
  speedSlider.style.width = canvasWidth;

  const resetButton = document.getElementById("reset-button");
  resetButton.style.width = canvasWidth;
}

function addEventHandlers() {
  onTransformationButtonClicked();
  onSpeedSliderChange();
  onResetButtonClicked();
}

function onTransformationButtonClicked() {
  const buttons = getTransformationButtons();

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
        window.cancelAnimationFrame(requestAnimationFrameId);
        draw(i);
    });
  }
}

function onSpeedSliderChange() {
    const speedSlider = document.getElementById("speed-slider");
    speedSlider.addEventListener("change", setDelayBetweenFrames);
}

function onResetButtonClicked() {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => {
    window.cancelAnimationFrame(requestAnimationFrameId);
    draw();
  });
}

function getTransformationButtons() {
  return document
    .getElementById("transformation-buttons-container")
    .getElementsByTagName("button");
}

function setDelayBetweenFrames() {
    const speedSlider = document.getElementById("speed-slider");
    delayBetweenFrames = speedSlider.getAttribute("max") - speedSlider.value;
}