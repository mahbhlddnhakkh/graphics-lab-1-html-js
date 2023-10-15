import { SendErrorMessage, Clamp, CreateGaussianKernel, GetMatrixFromTextarea, GetOffsetFromElement, NumArrayFindMaxIndex, NumArrayFindMinIndex, GetHistogram, ArithmeticMeanColors, RootMeanSquareColors } from "./util.js";
import { ApplyPerPixelFilter, ApplyMatrixFilter, ApplyGeometryFilter, ApplyDialation, ApplyErosion, ApplyOpening, ApplyClosing, ApplyGrad, ApplyTopHat, ApplyBlackHat, ApplyMedianFilter, ApplyDataPerPixelOperator } from "./filters-base.js";

const oneFilterDictTest = {
  "(тест)": {
    "args": {
      "Тип": {
        "label": "Тип",
        "type": "select",
        "values": [
          "По x", "По y", "Оба + среднее арифметическое", "Оба + среднее квадратичное",
        ],
      },
      "test2": {
        "label": "test3",
        "type": "input",
        "input-type": "checkbox",
        "checked": false,
        "value": ""
      },
      "default text": {
        "label": "default txt",
        "type": "input",
        "input-type": "text",
        "value": ""
      },
      "big textarea": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Напишите что-нибудь",
        "value": "",
      },
    },
    "func": NaNFilter,
  },
}

export let filtersDict = {
  "NaN": null,
  "Поточечные фильтры": null,
  "Инверсия": {
    "args": {},
    "func": DoInverseFilter,
  },
  "Чёрно-белое": {
    "args": {},
    "func": DoGrayScaleFilter,
  },
  "Сепия": {
    "args": {
      "k": {
        "label": "Коэффициент",
        "type": "input",
        "input-type": "number",
        "value": "25",
      },
    },
    "func": DoSepiaFilter,
  },
  "Увеличение яркости": {
    "args": {
      "k": {
        "label": "Коэффициент",
        "type": "input",
        "input-type": "number",
        "value": "50",
      },
    },
    "func": DoIncreaseBrightnessPerPixelFilter,
  },
  "Матричные фильтры": null,
  "Своя матрица": {
    "args": {
      "matrix": {
        "label": "Матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoOwnMatrixFilter,
  },
  "Резкость": {
    "args": {},
    "func": DoSharpenFilter,
  },
  "Простой блюр": {
    "args": {},
    "func": DoSimpleBlur,
  },
  "Фильтр Гаусса (блюр)": {
    "args": {
      "r": {
        "label": "Радиус > 0 ",
        "type": "input",
        "input-type": "number",
        "value": "3",
      },
      "s": {
        "label": "Сигма > 0 ",
        "type": "input",
        "input-type": "number",
        "value": "2",
      },
    },
    "func": DoGaussianFilter,
  },
  "Оператор Собеля": {
    "args": {
      "type": {
        "label": "Тип",
        "type": "select",
        "values": [
          "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
        ],
      },
    },
    "func": DoSobelOperator,
  },
  "Оператор Щарра": {
    "args": {
      "type": {
        "label": "Тип",
        "type": "select",
        "values": [
          "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
        ],
      },
    },
    "func": DoScharrOperator,
  },
  "Оператор Прюитта": {
    "args": {
      "type": {
        "label": "Тип",
        "type": "select",
        "values": [
          "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
        ],
      },
    },
    "func": DoPrewittOperator,
  },
  "Геометрические преобразования": null,
  "Перенос": {
    "args": {
      "x": {
        "label": "dx",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
      "y": {
        "label": "dy",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
    },
    "func": DoShiftFilter,
  },
  "Поворот": {
    "args": {
      "Центр поворота (x0, y0)": null,
      "x0": {
        "label": "x0",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
      "y0": {
        "label": "y0",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
      "angle": {
        "label": "Угол поворота (градусы)",
        "type": "input",
        "input-type": "number",
        "value": "0",
      }
    },
    "func": DoRotateFilter,
  },
  "Волна 1": {
    "args": {},
    "func": DoWave1Filter,
  },
  "Волна 2": {
    "args": {},
    "func": DoWave2Filter,
  },
  "Эффект стекла": {
    "args": {},
    "func": DoGlassEffectFilter,
  },
  "Операции мат морфологии": null,
  "Расширение (dialation)": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoDialation,
  },
  "Сужение (erosion)": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoErosion,
  },
  "Открытие (opening)": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoOpening,
  },
  "Закрытие (closing)": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoClosing,
  },
  "Градиент": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoGrad,
  },
  "Top hat": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoTopHat,
  },
  "Black hat": {
    "args": {
      "matrix": {
        "label": "Бинарная матрица",
        "type": "textarea",
        "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
        "value": "",
      },
    },
    "func": DoBlackHat,
  },
  "Медианный фильтр": {
    "args": {
      "r": {
        "label": "Радиус > 0<br>Размер=радиус*2+1",
        "type": "input",
        "input-type": "number",
        "value": "1",
      },
    },
    "func": DoMedianFilter,
  },
  "Цветокоррекции": null,
  "Линейная коррекция": {
    "args": {},
    "func": DoLinearCorrection,
  },
  "Гамма-коррекция": {
    "args": {
      "c": {
        "label": "Константа 'c' > 0 ",
        "type": "input",
        "input-type": "number",
        "value": "1",
      },
      "gam": {
        "label": "Гамма > 0 ",
        "type": "input",
        "input-type": "number",
        "value": "0.45",
      },
    },
    "func": DoGammaCorrection,
  },
  "Логарифмическая коррекция": {
    "args": {
      "c": {
        "label": "Константа 'c' > 0 ",
        "type": "input",
        "input-type": "number",
        "value": "15",
      },
    },
    "func": DoLogCorrection,
  },
  "Серый мир": {
    "args": {},
    "func": DoGreyWorld,
  },
  "Идеальный отражатель": {
    "args": {},
    "func": DoPerfectReflector,
  },
  "Коррекция с опорным цветом": {
    "args": {
      "Введите цвет (0-255)": null,
      "r1": {
        "label": "R",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
      "g1": {
        "label": "G",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
      "b1": {
        "label": "B",
        "type": "input",
        "input-type": "number",
        "value": "0",
      },
    },
    "Введите правильный для него цвет (0-255)": null,
    "r2": {
      "label": "R",
      "type": "input",
      "input-type": "number",
      "value": "0",
    },
    "g2": {
      "label": "G",
      "type": "input",
      "input-type": "number",
      "value": "0",
    },
    "b2": {
      "label": "B",
      "type": "input",
      "input-type": "number",
      "value": "0",
    },
    "func": DoColorMappingCorrection,
  }
};

export function FiltersInit() {
  let dropdowns = document.getElementById("select-filter");
  // https://stackoverflow.com/a/34913701
  Object.keys(filtersDict).forEach(function (key) {
    if (key != "NaN") {
      let e = document.createElement('option');
      if (filtersDict[key] != null) {
        e.value = key;
      }
      else {
        e.disabled = true;
        e.value = "";
      }
      e.innerHTML = key;
      dropdowns.appendChild(e);
    }
  });
}

// forgor to use it bruh. who cares?
export function GetFilterProperties(/*String*/ filter) {
  if (!(filter in Object.keys(filtersDict)))
    return filtersDict["NaN"];
  return filtersDict[filter];
}

function NaNFilter(/*Canvas*/ canvas = null, /*ImageData*/ data = null, /*Dict*/ arg = {}) {
  SendErrorMessage("NaN фильтр. Этот фильтр ещё не готов (или это вообще тестовый фильтр).", true);
  return;
}

function DoInverseFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    return [255 - r, 255 - g, 255 - b, a];
  });
}

function DoGrayScaleFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    let intens = 0.36 * r + 0.53 * g + 0.11 * b;
    return [intens, intens, intens, a];
  });
}

function DoSepiaFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let k = Number(arg["k"]["val"]);
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    let intens = 0.36 * r + 0.53 * g + 0.11 * b;
    return [Clamp(intens + 2 * k, 0, 255), Clamp(intens + 0.5 * k, 0, 255), Clamp(intens - k, 0, 255), a];
  });
}

function DoIncreaseBrightnessPerPixelFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let k = Number(arg["k"]["val"]);
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    return [Clamp(r + k, 0, 255), Clamp(g + k, 0, 255), Clamp(b + k, 0, 255), a];
  });
}

function DoOwnMatrixFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let kernel = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyMatrixFilter(canvas, data, kernel);
}

function DoSharpenFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  let kernel = new Array(3);
  for (let i = 0; i < 3; i++) {
    kernel[i] = new Array(3);
    for (let j = 0; j < 3; j++) {
      kernel[i][j] = -1.0;
    }
  }
  kernel[1][1] = 9.0;
  ApplyMatrixFilter(canvas, data, kernel);
}

function DoSimpleBlur(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  let kernel = new Array(3);
  for (let i = 0; i < 3; i++) {
    kernel[i] = new Array(3);
    for (let j = 0; j < 3; j++) {
      kernel[i][j] = 1.0 / 9.0;
    }
  }
  ApplyMatrixFilter(canvas, data, kernel);
}

function DoGaussianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let radius = Number(arg["r"]["val"]);
  if (radius <= 0) {
    SendErrorMessage("Радиус должен быть > 0.", true);
  }
  let sigma = parseFloat(arg["s"]["val"]);
  if (sigma <= 0.0 + Number.EPSILON) {
    SendErrorMessage("Сигма должна быть > 0.", true);
  }
  let kernel = CreateGaussianKernel(radius, sigma);
  ApplyMatrixFilter(canvas, data, kernel);
}

function DoSobelOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  if (arg["type"]["val"] > 3) {
    SendErrorMessage("Выбрано значение за пределом списка.", true);
  }
  let kernelX = new Array(3);
  let kernelY = new Array(3);
  for (let i = 0; i < 3; i++) {
    kernelX[i] = new Array(3);
    kernelY[i] = new Array(3);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j == 0) {
        kernelX[i][j] = -1;
        kernelY[j][i] = -1;
      }
      else if (j == 1) {
        kernelX[i][j] = 0;
        kernelY[j][i] = 0;
      }
      else if (j == 2) {
        kernelX[i][j] = 1;
        kernelY[j][i] = 1;
      }
    }
  }
  kernelX[1][0] = -2;
  kernelY[0][1] = -2;
  kernelX[1][2] = 2;
  kernelY[2][1] = 2;
  if (arg["type"]["val"] === 0) {
    ApplyMatrixFilter(canvas, data, kernelX);
  }
  else if (arg["type"]["val"] === 1) {
    ApplyMatrixFilter(canvas, data, kernelY);
  }
  else {
    let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
    let ctx = canvas.getContext("2d");
    let tmpCanvases = new Array(2);
    for (let i = 0; i < 2; i++) {
      tmpCanvases[i] = document.createElement("canvas");
      tmpCanvases[i].width = canvas.width;
      tmpCanvases[i].height = canvas.height;
      let tmpCtx = tmpCanvases[i].getContext("2d");
      tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    }
    ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
      ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
        let tmpDatas = new Array(2);
        for (let i = 0; i < 2; i++) {
          let tmpCtx = tmpCanvases[i].getContext("2d");
          tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
        }
        if (arg["type"]["val"] === 2) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
        }
        else if (arg["type"]["val"] === 3) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
        }
        else {
          SendErrorMessage("Выбрано значение за пределом списка.", true);
        }
      });
    });
  }
}

function DoScharrOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  if (arg["type"]["val"] > 3) {
    SendErrorMessage("Выбрано значение за пределом списка.", true);
  }
  let kernelX = new Array(3);
  let kernelY = new Array(3);
  for (let i = 0; i < 3; i++) {
    kernelX[i] = new Array(3);
    kernelY[i] = new Array(3);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j == 0) {
        kernelX[i][j] = 3;
        kernelY[j][i] = 3;
      }
      else if (j == 1) {
        kernelX[i][j] = 0;
        kernelY[j][i] = 0;
      }
      else if (j == 2) {
        kernelX[i][j] = -3;
        kernelY[j][i] = -3;
      }
    }
  }
  kernelX[1][0] = 10;
  kernelY[0][1] = 10;
  kernelX[1][2] = -10;
  kernelY[2][1] = -10;
  if (arg["type"]["val"] === 0) {
    ApplyMatrixFilter(canvas, data, kernelX);
  }
  else if (arg["type"]["val"] === 1) {
    ApplyMatrixFilter(canvas, data, kernelY);
  }
  else {
    let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
    let ctx = canvas.getContext("2d");
    let tmpCanvases = new Array(2);
    for (let i = 0; i < 2; i++) {
      tmpCanvases[i] = document.createElement("canvas");
      tmpCanvases[i].width = canvas.width;
      tmpCanvases[i].height = canvas.height;
      let tmpCtx = tmpCanvases[i].getContext("2d");
      tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    }
    ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
      ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
        let tmpDatas = new Array(2);
        for (let i = 0; i < 2; i++) {
          let tmpCtx = tmpCanvases[i].getContext("2d");
          tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
        }
        if (arg["type"]["val"] === 2) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
        }
        else if (arg["type"]["val"] === 3) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
        }
        else {
          SendErrorMessage("Выбрано значение за пределом списка.", true);
        }
      });
    });
  }
}

function DoPrewittOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  if (arg["type"]["val"] > 3) {
    SendErrorMessage("Выбрано значение за пределом списка.", true);
  }
  let kernelX = new Array(3);
  let kernelY = new Array(3);
  for (let i = 0; i < 3; i++) {
    kernelX[i] = new Array(3);
    kernelY[i] = new Array(3);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j == 0) {
        kernelX[i][j] = -1;
        kernelY[j][i] = -1;
      }
      else if (j == 1) {
        kernelX[i][j] = 0;
        kernelY[j][i] = 0;
      }
      else if (j == 2) {
        kernelX[i][j] = 1;
        kernelY[j][i] = 1;
      }
    }
  }
  if (arg["type"]["val"] === 0) {
    ApplyMatrixFilter(canvas, data, kernelX);
  }
  else if (arg["type"]["val"] === 1) {
    ApplyMatrixFilter(canvas, data, kernelY);
  }
  else {
    let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
    let ctx = canvas.getContext("2d");
    let tmpCanvases = new Array(2);
    for (let i = 0; i < 2; i++) {
      tmpCanvases[i] = document.createElement("canvas");
      tmpCanvases[i].width = canvas.width;
      tmpCanvases[i].height = canvas.height;
      let tmpCtx = tmpCanvases[i].getContext("2d");
      tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    }
    ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
      ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
        let tmpDatas = new Array(2);
        for (let i = 0; i < 2; i++) {
          let tmpCtx = tmpCanvases[i].getContext("2d");
          tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
        }
        if (arg["type"]["val"] === 2) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
        }
        else if (arg["type"]["val"] === 3) {
          ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
        }
        else {
          SendErrorMessage("Выбрано значение за пределом списка.", true);
        }
      });
    });
  }
}

function DoShiftFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  const shiftX = Number(arg["x"]["val"]);
  if (shiftX == NaN)
    SendErrorMessage("Введено неверное значение x", true);
  const shiftY = Number(arg["y"]["val"]);
  if (shiftY == NaN)
    SendErrorMessage("Введено неверное значение y", true);
  ApplyGeometryFilter(canvas, data, function (k, l) {
    let x = k + shiftX;
    let y = l + shiftY;
    return [x, y];
  });
}

function DoRotateFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  const x0 = Number(arg["x0"]["val"]);
  if (x0 == NaN)
    SendErrorMessage("Введено неверное значение x0", true);
  const y0 = Number(arg["y0"]["val"]);
  if (x0 == NaN)
    SendErrorMessage("Введено неверное значение y0", true);
  const angle = Number.parseFloat(arg["angle"]["val"]) * Math.PI / 180.0;
  if (angle == NaN)
    SendErrorMessage("Введено неверное значение угла", true);
  ApplyGeometryFilter(canvas, data, function (k, l) {
    let x = Math.round((k - x0) * Math.cos(angle) - (l - y0) * Math.sin(angle) + x0);
    let y = Math.round((k - x0) * Math.sin(angle) + (l - y0) * Math.cos(angle) + y0);
    return [x, y]
  });
}

function DoWave1Filter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  ApplyGeometryFilter(canvas, data, function (k, l) {
    let x = Math.round(k + 20.0 * Math.sin(2 * Math.PI * l / 60.0));
    let y = l;
    return [x, y];
  }, false);
}

function DoWave2Filter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  ApplyGeometryFilter(canvas, data, function (k, l) {
    let x = Math.round(k + 20.0 * Math.sin(2 * Math.PI * k / 30.0));
    let y = l;
    return [x, y];
  }, false);
}

function DoGlassEffectFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  ApplyGeometryFilter(canvas, data, function (k, l) {
    let x = Math.round(k + (Math.random() - 0.5) * 10.0);
    let y = Math.round(l + (Math.random() - 0.5) * 10.0);
    return [x, y];
  }, false)
}

function DoDialation(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyDialation(canvas, data, mask);
}

function DoErosion(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyErosion(canvas, data, mask);
}

function DoOpening(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyOpening(canvas, data, mask);
}

function DoClosing(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyClosing(canvas, data, mask);
}

function DoGrad(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyGrad(canvas, data, mask);
}

function DoTopHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyTopHat(canvas, data, mask);
}

function DoBlackHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
  ApplyBlackHat(canvas, data, mask);
}

function DoMedianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let radius = Number(arg["r"]["val"]);
  if (radius <= 0) {
    SendErrorMessage("Радиус должен быть > 0.", true);
  }
  ApplyMedianFilter(canvas, data, radius);
}

function DoLinearCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {})
{
  let histograms = [GetHistogram(data, "r"), GetHistogram(data, "g"), GetHistogram(data, "b")]
  let min = new Array(3);
  let max = new Array(3);
  for (let i = 0; i < 3; i++) {
    min[i] = NumArrayFindMinIndex(histograms[i]);
    max[i] = NumArrayFindMaxIndex(histograms[i]);
  }
  ApplyPerPixelFilter(canvas, data, function(r, g, b, a) {
    let arr = [r, g, b, a];
    for (let i = 0; i < 3; i++) {
      arr[i] = (arr[i] - min[i])*255.0/(max[i] - min[i]);
    }
    return arr;
  });
}

//function DoLinearCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
//  let histogram = GetHistogram(data, "hsl");
//  let min = NumArrayFindMinIndex(histogram);
//  let max = NumArrayFindMaxIndex(histogram);
//  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
//    let arr = [r, g, b, a];
//    for (let i = 0; i < 3; i++) {
//      arr[i] = (arr[i] - min) * 255.0 / (max - min);
//    }
//    return arr;
//  });
//}

function DoGammaCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let c = parseFloat(arg["c"]["val"]);
  if (c <= 0.0 + Number.EPSILON) {
    SendErrorMessage("Константа должна быть > 0.", true);
  }
  let gam = parseFloat(arg["gam"]["val"]);
  if (gam <= 0.0 + Number.EPSILON) {
    SendErrorMessage("Гамма должна быть > 0.", true);
  }
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    let arr = [r, g, b, a];
    for (let i = 0; i < 3; i++) {
      arr[i] = arr[i] / 255.0;
      arr[i] = c * Math.pow(arr[i], gam);
      arr[i] = arr[i] * 255.0;
    }
    return arr;
  });
}

function DoLogCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let c = parseFloat(arg["c"]["val"]);
  if (c <= 0.0 + Number.EPSILON) {
    SendErrorMessage("Константа должна быть > 0.", true);
  }
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    let arr = [r, g, b, a];
    for (let i = 0; i < 3; i++) {
      arr[i] = c * Math.log(arr[i] + 1.0);
    }
    return arr;
  });
}

function DoGreyWorld(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  let colorsAvg = [0, 0, 0];
  let n = Math.floor(data.data.length / 4 + Number.EPSILON);
  for (let i = 0; i < data.data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      colorsAvg[j] += data.data[i + j] / n;
    }
  }
  let avg = 0;
  for (let j = 0; j < 3; j++) {
    avg += colorsAvg[j];
  }
  avg /= 3.0;
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    return [r * avg / colorsAvg[0], g * avg / colorsAvg[1], b * avg / colorsAvg[2], a];
  });
}

function DoPerfectReflector(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
  let colorsMax = [0, 0, 0];
  for (let i = 0; i < data.data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      if (data.data[i + j] > colorsMax[j]) {
        colorsMax[j] = data.data[i + j];
      }
    }
  }
  let cs = new Array(3);
  for (let j = 0; j < 3; j++) {
    cs[j] = 255.0 / colorsMax[j];
  }
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    return [r * cs[0], g * cs[1], b * cs[2], a];
  });
}

function DoColorMappingCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
  let colors = {};
  Object.keys(arg).forEach(function (key) {
    if (arg[key]["val"] != null) {
      colors[key] = Number(arg[key]["val"]);
      if (colors[key] < 0 || colors[key] > 255) {
        let tmp;
        if (key[1] == "1") {
          tmp = "исходного";
        }
        else {
          tmp = "правильного";
        }
        SendErrorMessage("Неверное значение канала " + key[0].toUpperCase() + " " + tmp + " цвета.", true);
      }
    }
  });
  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
    return [r * colors["r2"] / colors["r1"], g * colors["g2"] / colors["g1"], b * colors["b2"] / colors["b1"], a];
  });
}
