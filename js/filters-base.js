import { SendErrorMessage, Clamp, ProgressBarCallback, ProgressBarReset, ProgressBarInit, GetMatrixColorFromImgData, GetMatrixIndexFromImgDataIndex, GetImgDataIndexFromMatrixIndex, SetPixelImgData, SetPixelImgDataByIndex, GetOffsetFromElement, CopyImageData, DirtHistogram, SubtractColors } from "./util.js";
import { HistoryAdd, HistoryLog } from "./history.js";

const parts = 100;

export function ApplyPerPixelFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*functon*/ func, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // func(r, g, b, a) -> [r, g, b, a]
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  function ApplyPerPixelFilterUpdate() {
    do {
      let pixels = func(data.data[i + 0], data.data[i + 1], data.data[i + 2], data.data[i + 3]);
      SetPixelImgDataByIndex(tmpData, i, pixels[0], pixels[1], pixels[2], pixels[3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyPerPixelFilterUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyPerPixelFilterUpdate();
}

export function ApplyMatrixFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ kernel, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // kernel matrix with only odd size
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  let radX = Math.floor(kernel.length / 2 + Number.EPSILON);
  let radY = Math.floor(kernel[0].length / 2 + Number.EPSILON);
  function ApplyMatrixFilterUpdate() {
    do {
      let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
      let result = [0.0, 0.0, 0.0];
      for (let l = -radY; l <= radY; l++) {
        for (let k = -radX; k <= radX; k++) {
          let idX = Clamp(x + k, 0, data.width - 1);
          let idY = Clamp(y + l, 0, data.height - 1);
          let nColor = GetMatrixColorFromImgData(data, idX, idY);
          for (let j = 0; j < 3; j++) {
            result[j] += nColor[j] * kernel[k + radX][l + radY];
          }
        }
      }
      SetPixelImgDataByIndex(tmpData, i, result[0], result[1], result[2], data.data[i + 3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyMatrixFilterUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyMatrixFilterUpdate();
}

export function ApplyGeometryFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*functon*/ func, /*bool*/ startWithEmptyCanvas = true, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // func(k, l) -> [ x, y ]
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  if (startWithEmptyCanvas) {
    tmpCtx.fillStyle = "rgba(0, 0, 0, 255)";
    tmpCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
  else {
    tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  }
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  function ApplyGeometryFilterUpdate() {
    do {
      let [k, l] = GetMatrixIndexFromImgDataIndex(data, i);
      let [x, y] = func(k, l);
      if (x >= 0 && y >= 0 && x < data.width && y < data.height) {
        let j = GetImgDataIndexFromMatrixIndex(data, x, y);
        //SetPixelImgData(tmpData, x, y, data.data[i+0], data.data[i+1], data.data[i+2], data.data[i+3]);
        SetPixelImgDataByIndex(tmpData, i, data.data[j + 0], data.data[j + 1], data.data[j + 2], data.data[j + 3]);
      }
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyGeometryFilterUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyGeometryFilterUpdate();
}

export function ApplyDialation(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix bool*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // mask matrix with only odd size
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  let radX = Math.floor(mask.length / 2 + Number.EPSILON);
  let radY = Math.floor(mask[0].length / 2 + Number.EPSILON);
  function ApplyDialationUpdate() {
    do {
      let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
      let max = [0, 0, 0];
      for (let l = -radY; l <= radY; l++) {
        for (let k = -radX; k <= radX; k++) {
          let idX = Clamp(x + k, 0, data.width - 1);
          let idY = Clamp(y + l, 0, data.height - 1);
          if ((mask[k + radX][l + radY])) {
            let cmpIndex = GetImgDataIndexFromMatrixIndex(data, idX, idY);
            if (((data.data[cmpIndex + 0] + data.data[cmpIndex + 1] + data.data[cmpIndex + 2]) / 3) > ((max[0] + max[1] + max[2]) / 3)) {
              max[0] = data.data[cmpIndex + 0];
              max[1] = data.data[cmpIndex + 1];
              max[2] = data.data[cmpIndex + 2];
            }
            //for (let t = 0; t < 3; t++) {
            //  if (data.data[cmpIndex+t] > max[t]) {
            //    max[t] = data.data[cmpIndex+t];
            //  }
            //}
          }
        }
      }
      SetPixelImgDataByIndex(tmpData, i, max[0], max[1], max[2], data.data[i + 3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyDialationUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyDialationUpdate();
}

export function ApplyErosion(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // mask matrix with only odd size
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  let radX = Math.floor(mask.length / 2 + Number.EPSILON);
  let radY = Math.floor(mask[0].length / 2 + Number.EPSILON);
  function ApplyDialationUpdate() {
    do {
      let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
      let min = [255, 255, 255];
      for (let l = -radY; l <= radY; l++) {
        for (let k = -radX; k <= radX; k++) {
          let idX = Clamp(x + k, 0, data.width - 1);
          let idY = Clamp(y + l, 0, data.height - 1);
          if ((mask[k + radX][l + radY])) {
            let cmpIndex = GetImgDataIndexFromMatrixIndex(data, idX, idY);
            if (((data.data[cmpIndex + 0] + data.data[cmpIndex + 1] + data.data[cmpIndex + 2]) / 3) < ((min[0] + min[1] + min[2]) / 3)) {
              min[0] = data.data[cmpIndex + 0];
              min[1] = data.data[cmpIndex + 1];
              min[2] = data.data[cmpIndex + 2];
            }
            //for (let t = 0; t < 3; t++) {
            //  if (data.data[cmpIndex+t] > min[t]) {
            //    min[t] = data.data[cmpIndex+t];
            //  }
            //}
          }
        }
      }
      SetPixelImgDataByIndex(tmpData, i, min[0], min[1], min[2], data.data[i + 3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyDialationUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyDialationUpdate();
}

export function ApplyOpening(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  ApplyErosion(canvas, data, mask, false, function () {
    // Need to renew
    let ctx = canvas.getContext("2d");
    let [x, y, w, h] = GetOffsetFromElement(canvas);
    ApplyDialation(canvas, ctx.getImageData(x, y, w, h), mask, doHistoryAdd, doAfter);
  });
}

export function ApplyClosing(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  ApplyDialation(canvas, data, mask, false, function () {
    // Need to renew
    let ctx = canvas.getContext("2d");
    let [x, y, w, h] = GetOffsetFromElement(canvas);
    ApplyErosion(canvas, ctx.getImageData(x, y, w, h), mask, doHistoryAdd, doAfter);
  });
}

export function ApplyGrad(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let tmpCanvases = new Array(2);
  for (let i = 0; i < 2; i++) {
    tmpCanvases[i] = document.createElement("canvas");
    tmpCanvases[i].width = canvas.width;
    tmpCanvases[i].height = canvas.height;
    let tmpCtx = tmpCanvases[i].getContext("2d");
    tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    //tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
  }
  ApplyDialation(tmpCanvases[0], data, mask, false, function () {
    ApplyErosion(tmpCanvases[1], data, mask, false, function () {
      let tmpDatas = new Array(2);
      for (let i = 0; i < 2; i++) {
        let tmpCtx = tmpCanvases[i].getContext("2d");
        tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
      }
      ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], SubtractColors, doHistoryAdd, doAfter);
    });
  });
}

export function ApplyTopHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  ApplyClosing(tmpCanvas, data, mask, false, function () {
    let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
    ApplyDataPerPixelOperator(canvas, data, tmpData, SubtractColors, doHistoryAdd, doAfter);
  });

}

export function ApplyBlackHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  ApplyOpening(tmpCanvas, data, mask, false, function () {
    let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
    ApplyDataPerPixelOperator(canvas, tmpData, data, SubtractColors, doHistoryAdd, doAfter);
  });
}

export function ApplyMedianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Integer*/ rad, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data.width * data.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
  const total = data.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  let radX = rad;
  let radY = rad;
  function ApplyMedianFilterUpdate() {
    do {
      let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
      let arrR = [];
      let arrG = [];
      let arrB = [];
      for (let l = -radY; l <= radY; l++) {
        for (let k = -radX; k <= radX; k++) {
          let idX = Clamp(x + k, 0, data.width - 1);
          let idY = Clamp(y + l, 0, data.height - 1);
          let nColor = GetMatrixColorFromImgData(data, idX, idY);
          arrR.push(nColor[0]);
          arrG.push(nColor[1]);
          arrB.push(nColor[2]);
        }
      }
      function InSort(a, b) {
        return a - b;
      }
      arrR.sort(InSort);
      arrG.sort(InSort);
      arrB.sort(InSort);
      let resInds = [Math.floor(arrR.length / 2 + Number.EPSILON), Math.floor(arrG.length / 2 + Number.EPSILON), Math.floor(arrB.length / 2 + Number.EPSILON)];
      SetPixelImgDataByIndex(tmpData, i, arrR[resInds[0]], arrG[resInds[1]], arrB[resInds[2]], data.data[i + 3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyMedianFilterUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyMedianFilterUpdate();
}

export function ApplyDataPerPixelOperator(/*Canvas*/ canvas, /*ImageData*/ data1, /*ImageData*/ data2, /*functon*/ func, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
  // func(colors1, colors2) -> [r, g, b, a]
  if (data1.data.length != data2.data.length || data1.width != data2.width || data1.height != data2.height) {
    SendErrorMessage("Размеры data1 и data2 разные.", true);
  }
  ProgressBarInit();
  let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
  let ctx = canvas.getContext("2d");
  let completedProgress = 0;
  const totalProgress = data1.width * data1.height;
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvas.width;
  tmpCanvas.height = canvas.height;
  let tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.fillStyle = "rgba(0, 0, 0, 255)";
  tmpCtx.fillRect(0, 0, canvas.width, canvas.height);
  let tmpData = tmpCtx.getImageData(offX, offY, data1.width, data1.height);
  const total = data1.data.length;
  const stopPart = Math.floor(total / parts + Number.EPSILON);
  let i = 0;
  function ApplyDataPerPixelOperatorUpdate() {
    do {
      let pixels = func([data1.data[i + 0], data1.data[i + 1], data1.data[i + 2], data1.data[i + 3]], [data2.data[i + 0], data2.data[i + 1], data2.data[i + 2], data2.data[i + 3]]);
      SetPixelImgDataByIndex(tmpData, i, pixels[0], pixels[1], pixels[2], pixels[3]);
      i += 4;
      completedProgress++;
    } while (i % stopPart != 0 && i < total)
    if (i < total) {
      ProgressBarCallback(totalProgress, completedProgress);
      setTimeout(ApplyDataPerPixelOperatorUpdate);
    }
    else {
      ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
      doAfter();
    }
  }
  ApplyDataPerPixelOperatorUpdate();
}

function ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd = true) {
  ctx.putImageData(tmpData, offX, offY);
  if (doHistoryAdd) {
    HistoryAdd(ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height));
    HistoryLog();
  }
  tmpCanvas.remove();
  ProgressBarReset();
  document.getElementById("reset-button").disabled = false;
  DirtHistogram();
}
