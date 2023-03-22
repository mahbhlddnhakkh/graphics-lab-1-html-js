export function NumArrayFindMaxIndex(/*Array*/ arr) {
  let max = -Infinity;
  let maxInd = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      maxInd = i;
    }
  }
  return maxInd;
}

export function NumArrayFindMinIndex(/*Array*/ arr) {
  let min = Infinity;
  let minInd = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
      minInd = i;
    }
  }
  return minInd;
}

export function NumArrayFindMax(/*Array*/ arr) {
  return arr.reduce((a, b) => Math.max(a, b), -Infinity);
}

export function NumArrayFindMin(/*Array*/ arr) {
  return arr.reduce((a, b) => Math.min(a, b), Infinity);
}

export function GetPixelBrightnessLuma(/*uint*/ r,/*uint*/ g, /*uint*/ b) {
  return Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b + Number.EPSILON);
}

export function GetPixelBrightnessHSL(/*uint*/ r,/*uint*/ g, /*uint*/ b) {
  return Math.floor((Math.max(r, g, b) + Math.min(r, g, b)) / 2 + Number.EPSILON);
}

export function SubtractColors(color1, color2) {
  let arr = [0, 0, 0, color1[3]];
  for (let i = 0; i < 3; i++) {
    arr[i] = color1[i] - color2[i];
  }
  return arr;
}

export function ArithmeticMeanColors(color1, color2) {
  let arr = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    arr[i] = (color1[i] + color2[i]) / 2;
  }
  return arr;
}

export function RootMeanSquareColors(color1, color2) {
  let arr = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    arr[i] = Math.sqrt((color1[i] * color1[i] + color2[i] * color2[i]) / 2);
  }
  return arr;
}

export function GetMatrixColorFromImgData(/*ImageData*/ data,/*uint*/ x,/*uint*/ y) {
  let result = [0, 0, 0, 0];
  let i = GetImgDataIndexFromMatrixIndex(data, x, y);
  for (let j = 0; j < 4; j++) {
    result[j] = data.data[i + j];
  }
  return result;
}

export function GetMatrixIndexFromImgDataIndex(/*ImageData*/ data, /*uint*/ i) {
  if (i >= data.data.length)
    SendErrorMessage("Индекс вне массива.", true, ProgressBarReset);
  let imaginaryIndex = Math.floor(i / 4 + Number.EPSILON);
  let x = imaginaryIndex % data.width;
  let y = Math.floor(imaginaryIndex / data.width + Number.EPSILON);
  return [x, y];
}

export function GetImgDataIndexFromMatrixIndex(/*ImageData*/ data,/*uint*/ x,/*uint*/ y) {
  let res = (4 * (y * data.width + x));
  if (res >= data.data.length)
    SendErrorMessage("Индекс вне массива.", true, ProgressBarReset);
  return res;
}

export function SetPixelImgData(/*ImageData*/ data, /*uint*/ x,/*uint*/ y, /*uint*/ r,/*uint*/ g, /*uint*/ b,/*uint*/ a) {
  if (x < 0 || y < 0 || x >= data.width || y >= data.height)
    return;
  let index = GetImgDataIndexFromMatrixIndex(data, x, y);
  SetPixelImgDataByIndex(data, index, r, g, b, a);
}

export function SetPixelImgDataByIndex(/*ImageData*/ data, /*uint*/ i, /*uint*/ r,/*uint*/ g, /*uint*/ b,/*uint*/ a) {
  if (i < 0 || i >= data.data.length - 4)
    return;
  if (i % 4 != 0)
    SendErrorMessage(i.toString() + " % 4 != 0.", true, ProgressBarReset);
  data.data[i + 0] = Clamp(Math.floor(Math.abs(r) + Number.EPSILON), 0, 255);
  data.data[i + 1] = Clamp(Math.floor(Math.abs(g) + Number.EPSILON), 0, 255);
  data.data[i + 2] = Clamp(Math.floor(Math.abs(b) + Number.EPSILON), 0, 255);
  data.data[i + 3] = Clamp(Math.floor(Math.abs(a) + Number.EPSILON), 0, 255);
}

export function Clamp(value, min, max) {
  if (value <= min)
    return value;
  if (value >= max)
    return max;
  return value;
}

export function SendErrorMessage(/*String*/ message, /*bool*/ doThrow = false, /*function*/ func = () => { }, /*Element*/ e = document.getElementById("error-message")) {
  //let e = document.getElementById("error-message");
  let out = '[' + new Date().toLocaleString().replace(", ", "/") + '] ' + message;
  func();
  e.textContent = out;
  e.style.display = "block";
  if (doThrow)
    throw out;
  else
    console.error(out);
}

export function ProgressBarInit() {
  window.scrollTo(0, 0);
  let filterProgressBarDiv = document.getElementById("filter-progress-bar-div");
  let mainTable = document.getElementById("main-table");
  filterProgressBarDiv.style.display = "block";
  mainTable.style.display = "none";
}

export function ProgressBarCallback(/*Number*/ total, /*Number*/ completed) {
  let filterProgressBar = document.getElementById("filter-progress-bar");
  let result = completed.toString();
  filterProgressBar.value = result;
  filterProgressBar.innerHTML = result;
  filterProgressBar.max = total.toString();
}

export function ProgressBarReset() {
  let filterProgressBarDiv = document.getElementById("filter-progress-bar-div");
  let mainTable = document.getElementById("main-table");
  let filterProgressBar = document.getElementById("filter-progress-bar");
  filterProgressBar.value = "0";
  filterProgressBar.max = "100";
  filterProgressBar.innerHTML = "";
  filterProgressBarDiv.style.display = "none";
  mainTable.style.display = "";
}

export function GetOffsetFromElement(/*Canvas*/ canvas) {
  function f(v, canBeZero = true) {
    let res = Number(document.getElementById("offset-input-" + v).value);
    if (res < 0 || !Number.isInteger(res) || res == 0 && !canBeZero) {
      SendErrorMessage("Неверное значение оффсета по " + v + '.', true);
    }
    return res;
  }
  let [x, y, w, h] = [f("x"), f("y"), f("w", false), f("h", false)]
  if (x + w > canvas.width) {
    SendErrorMessage("Оффсет выходит за пределы изображения по ширине. " + x.toString() + '+' + w.toString() + '==' + (x + w).toString() + ">" + canvas.width.toString(), true);
  }
  if (y + h > canvas.height) {
    SendErrorMessage("Оффсет выходит за пределы изображения по высоте. " + y.toString() + '+' + h.toString() + '==' + (y + h).toString() + ">" + canvas.height.toString(), true);
  }
  return [x, y, w, h];
}

export function CopyImageData(/*ImageData*/ data) {
  let dataCopy = new Uint8ClampedArray(data.data);
  return new ImageData(dataCopy, data.width, data.height);
}

export function CreateGaussianKernel(/*Integer*/ radius, /*Float*/ sigma) {
  let size = 2 * radius + 1;
  let kernel = new Array(size);
  let norm = 0;
  for (let i = -radius; i <= radius; i++) {
    kernel[i + radius] = new Array(size);
    for (let j = -radius; j <= radius; j++) {
      kernel[i + radius][j + radius] = Math.exp(-(i * i + j * j) / (sigma * sigma));
      norm += kernel[i + radius][j + radius];
    }
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      kernel[i][j] /= norm;
    }
  }
  return kernel;
}

export function GetHistogram(/*ImageData*/ data, /*String*/ mode = "hsl") {
  let histogram = new Array(256).fill(0);
  if (mode == "r") {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[data.data[i + 0]] += 1;
    }
  }
  else if (mode == "r") {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[data.data[i + 1]] += 1;
    }
  }
  else if (mode == "b") {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[data.data[i + 2]] += 1;
    }
  }
  else if (mode == "a") {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[data.data[i + 3]] += 1; // why not?
    }
  }
  else if (mode == "luma") {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[GetPixelBrightnessLuma(data.data[i + 0], data.data[i + 1], data.data[i + 2])] += 1;
    }
  }
  else {
    for (let i = 0; i < data.data.length; i += 4) {
      histogram[GetPixelBrightnessHSL(data.data[i + 0], data.data[i + 1], data.data[i + 2])] += 1;
    }
  }
  return histogram;
}

export function DrawHistogram(/*Canvas*/ canvas, /*ImageData*/ dataInput, /*String*/ mode = "hsl") {
  let ctxOutput = canvas.getContext("2d");
  const colWidth = 4;
  const colMaxHeight = 128 * colWidth;
  canvas.width = colWidth * 256;
  canvas.height = colMaxHeight;
  let histogram = GetHistogram(dataInput, mode);
  //let maxBrightCount = Math.max.apply(null, histogram);
  let maxValueCount = NumArrayFindMax(histogram);
  //console.log(maxValueCount);
  let tmp = colMaxHeight / maxValueCount;
  //console.log("DrawHistogram");
  //console.log(histogram);
  ctxOutput.fillStyle = "rgba(255, 255, 255, 255)";
  ctxOutput.fillRect(0, 0, 256 * colWidth, colMaxHeight);
  if (mode == "r") {
    ctxOutput.fillStyle = "rgba(255, 0, 0, 255)";
  }
  else if (mode == "g") {
    ctxOutput.fillStyle = "rgba(0, 255, 0, 255)";
  }
  else if (mode == "b") {
    ctxOutput.fillStyle = "rgba(0, 0, 255, 255)";
  }
  else {
    ctxOutput.fillStyle = "rgba(0, 0, 0, 255)";
  }
  for (let i = 0; i < histogram.length; i++) {
    ctxOutput.fillRect(i * colWidth, colMaxHeight, colWidth, -Math.floor(histogram[i] * tmp + Number.EPSILON));
  }
  canvas.title = mode + ". Max " + NumArrayFindMax(histogram).toString();
  return histogram;
}

export function ShowHistogramCanvas() {
  document.getElementById("histogram-button").innerHTML = "Скрыть гистограмму";
  let canvasHSL = document.getElementById("histogram-canvas-edited-hsl");
  let ctx = canvasHSL.getContext("2d");
  if (IsHistogramDirty(ctx.getImageData(0, 0, 1, 1))) {
    let canvasEdit = document.getElementById("edited-img-canvas");
    let dataEdit = canvasEdit.getContext("2d").getImageData(0, 0, canvasEdit.width, canvasEdit.height);
    let canvases = new Array(3);
    let modes = ["r", "g", "b"];
    for (let i = 0; i < 3; i++) {
      canvases[i] = document.getElementById("histogram-canvas-edited-" + modes[i]);
      DrawHistogram(canvases[i], dataEdit, modes[i]);
    }
    DrawHistogram(canvasHSL, dataEdit, "hsl");
  }
  //canvas.style.display = "inline";
  document.getElementById("histograms-table").style.display = "inline";
}

export function DrawOriginalHistogramCanvas() {
  let canvasOriginal = document.getElementById("original-img-canvas");
  let dataOriginal = canvasOriginal.getContext("2d").getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
  let canvases = new Array(4);
  let modes = ["r", "g", "b", "hsl"];
  for (let i = 0; i < 4; i++) {
    canvases[i] = document.getElementById("histogram-canvas-original-" + modes[i]);
    DrawHistogram(canvases[i], dataOriginal, modes[i]);
  }
}

export function HideHistogramCanvas() {
  document.getElementById("histogram-button").innerHTML = "Показать гистограмму";
  document.getElementById("histograms-table").style.display = "none";
}

export function DirtHistogram(/*Canvas*/ canvas = document.getElementById("histogram-canvas-edited-hsl")) {
  let ctx = canvas.getContext("2d");
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 4; i++) {
    data.data[i] = 0;
  }
  ctx.putImageData(data, 0, 0);
  HideHistogramCanvas();
}

export function IsHistogramDirty(/*ImageData*/ data) {
  return (data.data[0] == 0 && data.data[1] == 0 && data.data[2] == 0 && data.data[3] == 0);
}

export function GetMatrixFromTextarea(/*String*/ str) {
  if (str === '') {
    let kernel = new Array(3);
    for (let i = 0; i < 3; i++) {
      kernel[i] = new Array(3);
      for (let j = 0; j < 3; j++) {
        if (i % 2 == 0 && j != 1) {
          kernel[i][j] = 0;
        }
        else {
          kernel[i][j] = 1;
        }
      }
    }
    return kernel;
  }
  let kernel = str.split('\n');
  if (kernel.length % 2 == 0) {
    // Becaue code from manual is not capable of processing matrices with even size.
    SendErrorMessage("Матрица не может иметь чётный размер.", true);
  }
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] = kernel[i].split(' ');
    if (kernel[i].length != kernel.length) {
      SendErrorMessage("Матрица не квадратная.", true);
    }
    for (let j = 0; j < kernel.length; j++) {
      kernel[i][j] = parseFloat(kernel[i][j]);
      if (kernel[i][j] == NaN) {
        SendErrorMessage("kernel[" + toString(i) + "][" + toString(j) + "] не число.", true);
      }
    }
  }
  return kernel;
}
