window.onload = () => {
  const fractalStepCount = 5;
  setDefaultOptions(500, fractalStepCount);
  addEventHandlers();
  draw(fractalStepCount);
};

function draw(stepCount = 5) {
  const canvas = document.getElementById("canvas");

  if (!canvas.getContext) {
    console.warn("Canvas is not supported");
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.getAttribute("width");
  const height = canvas.getAttribute("height");

  _drawBorder();
  _drawFractal(stepCount);

  function _drawBorder() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.stroke();
  }

  function _drawFractal(stepCount) {
    if (stepCount > 0) {
      stepCount = stepCount - 1;

      ctx.save();
      ctx.save();
      ctx.save();

      ctx.transform(0, 0.5, -0.5, 0, width / 2, 0);
      _drawFractal(stepCount, (color = "orange"));
      ctx.restore();

      ctx.transform(-0.5, 0, 0, 0.5, width, 0);
      _drawFractal(stepCount, (color = "red"));
      ctx.restore();

      ctx.transform(0, 0.25, 0.25, 0, width / 4, height / 2);
      _drawFractal(stepCount, (color = "green"));
      ctx.restore();

      ctx.transform(0.5, 0, 0, 0.5, width / 2, height / 2);
      _drawFractal(stepCount, (color = "blue"));
    } else {
      _drawBaseFractalFigure(color);
    }
  }

  function _drawBaseFractalFigure(color) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 0);
    ctx.lineTo(500, 500);
    ctx.lineTo(0, 275);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function setDefaultOptions(canvasSize, fractalStepCount) {
  const canvasSizeInput = document.getElementById("size-input");
  const fractalStepCountInput = document.getElementById("step-count-input");

  canvasSizeInput.value = canvasSize;
  fractalStepCountInput.value = fractalStepCount;
}

function addEventHandlers() {
  const redrawButton = document.getElementById("redraw-button");
  redrawButton.addEventListener("click", () => onRedrawClicked());
}

function onRedrawClicked() {
  const stepCountInputErrorId = "step-count-input-error";
  const canvasSizeInputErrorId = "size-input-error";

  const canvasSizeInput = document.getElementById("size-input");
  const fractalStepCountInput = document.getElementById("step-count-input");

  const newSize = canvasSizeInput.value;
  const newFractalStepCount = fractalStepCountInput.value;

  hideValidationErrors([stepCountInputErrorId, canvasSizeInputErrorId]);

  let isValid = true;

  if (isNullOrEmpty(newSize)) {
    showValidationError(canvasSizeInputErrorId, "Size is required");
    isValid = false;
  } else if (newSize <= 0) {
    showValidationError(canvasSizeInputErrorId, "Size must be positive number");
    isValid = false;
  }

  if (isNullOrEmpty(newFractalStepCount)) {
    showValidationError(
      stepCountInputErrorId,
      "Fractal step count is required"
    );
    isValid = false;
  } else if (newFractalStepCount <= 0) {
    showValidationError(
      stepCountInputErrorId,
      "Step count must be positive number"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  canvas.setAttribute("width", newSize);
  canvas.setAttribute("height", newSize);

  draw(newFractalStepCount);
}

function hideValidationErrors(elementsIds) {
  for (let i = 0; i < elementsIds.length; i++) {
    const elementToHide = document.getElementById(elementsIds[i]);
    elementToHide.style.display = "none";
    console.log(elementsIds[i]);
  }
}

function showValidationError(elementId, error) {
  const element = document.getElementById(elementId);
  element.style.display = "inline";
  element.innerHTML = error;
}

function isNullOrEmpty(value) {
  return value === null || value === "" || value === undefined;
}
