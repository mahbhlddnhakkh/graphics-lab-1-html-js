

// --------------------------------------------------------------------------------------------------------------------------------
// Compiled util.js
// --------------------------------------------------------------------------------------------------------------------------------

/*1*/ function NumArrayFindMaxIndex(/*Array*/ arr) {
/*2*/   let max = -Infinity;
/*3*/   let maxInd = 0;
/*4*/   for (let i = 0; i < arr.length; i++) {
/*5*/     if (arr[i] > max) {
/*6*/       max = arr[i];
/*7*/       maxInd = i;
/*8*/     }
/*9*/   }
/*10*/   return maxInd;
/*11*/ }
/*12*/ 
/*13*/ function NumArrayFindMinIndex(/*Array*/ arr) {
/*14*/   let min = Infinity;
/*15*/   let minInd = 0;
/*16*/   for (let i = 0; i < arr.length; i++) {
/*17*/     if (arr[i] < min) {
/*18*/       min = arr[i];
/*19*/       minInd = i;
/*20*/     }
/*21*/   }
/*22*/   return minInd;
/*23*/ }
/*24*/ 
/*25*/ function NumArrayFindMax(/*Array*/ arr) {
/*26*/   return arr.reduce((a, b) => Math.max(a, b), -Infinity);
/*27*/ }
/*28*/ 
/*29*/ function NumArrayFindMin(/*Array*/ arr) {
/*30*/   return arr.reduce((a, b) => Math.min(a, b), Infinity);
/*31*/ }
/*32*/ 
/*33*/ function GetPixelBrightnessLuma(/*uint*/ r,/*uint*/ g, /*uint*/ b) {
/*34*/   return Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b + Number.EPSILON);
/*35*/ }
/*36*/ 
/*37*/ function GetPixelBrightnessHSL(/*uint*/ r,/*uint*/ g, /*uint*/ b) {
/*38*/   return Math.floor((Math.max(r, g, b) + Math.min(r, g, b)) / 2 + Number.EPSILON);
/*39*/ }
/*40*/ 
/*41*/ function SubtractColors(color1, color2) {
/*42*/   let arr = [0, 0, 0, color1[3]];
/*43*/   for (let i = 0; i < 3; i++) {
/*44*/     arr[i] = color1[i] - color2[i];
/*45*/   }
/*46*/   return arr;
/*47*/ }
/*48*/ 
/*49*/ function ArithmeticMeanColors(color1, color2) {
/*50*/   let arr = [0, 0, 0, 0];
/*51*/   for (let i = 0; i < 4; i++) {
/*52*/     arr[i] = (color1[i] + color2[i]) / 2;
/*53*/   }
/*54*/   return arr;
/*55*/ }
/*56*/ 
/*57*/ function RootMeanSquareColors(color1, color2) {
/*58*/   let arr = [0, 0, 0, 0];
/*59*/   for (let i = 0; i < 4; i++) {
/*60*/     arr[i] = Math.sqrt((color1[i] * color1[i] + color2[i] * color2[i]) / 2);
/*61*/   }
/*62*/   return arr;
/*63*/ }
/*64*/ 
/*65*/ function GetMatrixColorFromImgData(/*ImageData*/ data,/*uint*/ x,/*uint*/ y) {
/*66*/   let result = [0, 0, 0, 0];
/*67*/   let i = GetImgDataIndexFromMatrixIndex(data, x, y);
/*68*/   for (let j = 0; j < 4; j++) {
/*69*/     result[j] = data.data[i + j];
/*70*/   }
/*71*/   return result;
/*72*/ }
/*73*/ 
/*74*/ function GetMatrixIndexFromImgDataIndex(/*ImageData*/ data, /*uint*/ i) {
/*75*/   if (i >= data.data.length)
/*76*/     SendErrorMessage("Индекс вне массива.", true, ProgressBarReset);
/*77*/   let imaginaryIndex = Math.floor(i / 4 + Number.EPSILON);
/*78*/   let x = imaginaryIndex % data.width;
/*79*/   let y = Math.floor(imaginaryIndex / data.width + Number.EPSILON);
/*80*/   return [x, y];
/*81*/ }
/*82*/ 
/*83*/ function GetImgDataIndexFromMatrixIndex(/*ImageData*/ data,/*uint*/ x,/*uint*/ y) {
/*84*/   let res = (4 * (y * data.width + x));
/*85*/   if (res >= data.data.length)
/*86*/     SendErrorMessage("Индекс вне массива.", true, ProgressBarReset);
/*87*/   return res;
/*88*/ }
/*89*/ 
/*90*/ function SetPixelImgData(/*ImageData*/ data, /*uint*/ x,/*uint*/ y, /*uint*/ r,/*uint*/ g, /*uint*/ b,/*uint*/ a) {
/*91*/   if (x < 0 || y < 0 || x >= data.width || y >= data.height)
/*92*/     return;
/*93*/   let index = GetImgDataIndexFromMatrixIndex(data, x, y);
/*94*/   SetPixelImgDataByIndex(data, index, r, g, b, a);
/*95*/ }
/*96*/ 
/*97*/ function SetPixelImgDataByIndex(/*ImageData*/ data, /*uint*/ i, /*uint*/ r,/*uint*/ g, /*uint*/ b,/*uint*/ a) {
/*98*/   if (i < 0 || i >= data.data.length - 4)
/*99*/     return;
/*100*/   if (i % 4 != 0)
/*101*/     SendErrorMessage(i.toString() + " % 4 != 0.", true, ProgressBarReset);
/*102*/   data.data[i + 0] = Clamp(Math.floor(Math.abs(r) + Number.EPSILON), 0, 255);
/*103*/   data.data[i + 1] = Clamp(Math.floor(Math.abs(g) + Number.EPSILON), 0, 255);
/*104*/   data.data[i + 2] = Clamp(Math.floor(Math.abs(b) + Number.EPSILON), 0, 255);
/*105*/   data.data[i + 3] = Clamp(Math.floor(Math.abs(a) + Number.EPSILON), 0, 255);
/*106*/ }
/*107*/ 
/*108*/ function Clamp(value, min, max) {
/*109*/   if (value <= min)
/*110*/     return value;
/*111*/   if (value >= max)
/*112*/     return max;
/*113*/   return value;
/*114*/ }
/*115*/ 
/*116*/ function SendErrorMessage(/*String*/ message, /*bool*/ doThrow = false, /*function*/ func = () => { }, /*Element*/ e = document.getElementById("error-message")) {
/*117*/   //let e = document.getElementById("error-message");
/*118*/   let out = '[' + new Date().toLocaleString().replace(", ", "/") + '] ' + message;
/*119*/   func();
/*120*/   e.textContent = out;
/*121*/   e.style.display = "block";
/*122*/   if (doThrow)
/*123*/     throw out;
/*124*/   else
/*125*/     console.error(out);
/*126*/ }
/*127*/ 
/*128*/ function ProgressBarInit() {
/*129*/   window.scrollTo(0, 0);
/*130*/   let filterProgressBarDiv = document.getElementById("filter-progress-bar-div");
/*131*/   let mainTable = document.getElementById("main-table");
/*132*/   filterProgressBarDiv.style.display = "block";
/*133*/   mainTable.style.display = "none";
/*134*/ }
/*135*/ 
/*136*/ function ProgressBarCallback(/*Number*/ total, /*Number*/ completed) {
/*137*/   let filterProgressBar = document.getElementById("filter-progress-bar");
/*138*/   let result = completed.toString();
/*139*/   filterProgressBar.value = result;
/*140*/   filterProgressBar.innerHTML = result;
/*141*/   filterProgressBar.max = total.toString();
/*142*/ }
/*143*/ 
/*144*/ function ProgressBarReset() {
/*145*/   let filterProgressBarDiv = document.getElementById("filter-progress-bar-div");
/*146*/   let mainTable = document.getElementById("main-table");
/*147*/   let filterProgressBar = document.getElementById("filter-progress-bar");
/*148*/   filterProgressBar.value = "0";
/*149*/   filterProgressBar.max = "100";
/*150*/   filterProgressBar.innerHTML = "";
/*151*/   filterProgressBarDiv.style.display = "none";
/*152*/   mainTable.style.display = "";
/*153*/ }
/*154*/ 
/*155*/ function GetOffsetFromElement(/*Canvas*/ canvas) {
/*156*/   function f(v, canBeZero = true) {
/*157*/     let res = Number(document.getElementById("offset-input-" + v).value);
/*158*/     if (res < 0 || !Number.isInteger(res) || res == 0 && !canBeZero) {
/*159*/       SendErrorMessage("Неверное значение оффсета по " + v + '.', true);
/*160*/     }
/*161*/     return res;
/*162*/   }
/*163*/   let [x, y, w, h] = [f("x"), f("y"), f("w", false), f("h", false)]
/*164*/   if (x + w > canvas.width) {
/*165*/     SendErrorMessage("Оффсет выходит за пределы изображения по ширине. " + x.toString() + '+' + w.toString() + '==' + (x + w).toString() + ">" + canvas.width.toString(), true);
/*166*/   }
/*167*/   if (y + h > canvas.height) {
/*168*/     SendErrorMessage("Оффсет выходит за пределы изображения по высоте. " + y.toString() + '+' + h.toString() + '==' + (y + h).toString() + ">" + canvas.height.toString(), true);
/*169*/   }
/*170*/   return [x, y, w, h];
/*171*/ }
/*172*/ 
/*173*/ function CopyImageData(/*ImageData*/ data) {
/*174*/   let dataCopy = new Uint8ClampedArray(data.data);
/*175*/   return new ImageData(dataCopy, data.width, data.height);
/*176*/ }
/*177*/ 
/*178*/ function CreateGaussianKernel(/*Integer*/ radius, /*Float*/ sigma) {
/*179*/   let size = 2 * radius + 1;
/*180*/   let kernel = new Array(size);
/*181*/   let norm = 0;
/*182*/   for (let i = -radius; i <= radius; i++) {
/*183*/     kernel[i + radius] = new Array(size);
/*184*/     for (let j = -radius; j <= radius; j++) {
/*185*/       kernel[i + radius][j + radius] = Math.exp(-(i * i + j * j) / (sigma * sigma));
/*186*/       norm += kernel[i + radius][j + radius];
/*187*/     }
/*188*/   }
/*189*/   for (let i = 0; i < size; i++) {
/*190*/     for (let j = 0; j < size; j++) {
/*191*/       kernel[i][j] /= norm;
/*192*/     }
/*193*/   }
/*194*/   return kernel;
/*195*/ }
/*196*/ 
/*197*/ function GetHistogram(/*ImageData*/ data, /*String*/ mode = "hsl") {
/*198*/   let histogram = new Array(256).fill(0);
/*199*/   if (mode == "r") {
/*200*/     for (let i = 0; i < data.data.length; i += 4) {
/*201*/       histogram[data.data[i + 0]] += 1;
/*202*/     }
/*203*/   }
/*204*/   else if (mode == "r") {
/*205*/     for (let i = 0; i < data.data.length; i += 4) {
/*206*/       histogram[data.data[i + 1]] += 1;
/*207*/     }
/*208*/   }
/*209*/   else if (mode == "b") {
/*210*/     for (let i = 0; i < data.data.length; i += 4) {
/*211*/       histogram[data.data[i + 2]] += 1;
/*212*/     }
/*213*/   }
/*214*/   else if (mode == "a") {
/*215*/     for (let i = 0; i < data.data.length; i += 4) {
/*216*/       histogram[data.data[i + 3]] += 1; // why not?
/*217*/     }
/*218*/   }
/*219*/   else if (mode == "luma") {
/*220*/     for (let i = 0; i < data.data.length; i += 4) {
/*221*/       histogram[GetPixelBrightnessLuma(data.data[i + 0], data.data[i + 1], data.data[i + 2])] += 1;
/*222*/     }
/*223*/   }
/*224*/   else {
/*225*/     for (let i = 0; i < data.data.length; i += 4) {
/*226*/       histogram[GetPixelBrightnessHSL(data.data[i + 0], data.data[i + 1], data.data[i + 2])] += 1;
/*227*/     }
/*228*/   }
/*229*/   return histogram;
/*230*/ }
/*231*/ 
/*232*/ function DrawHistogram(/*Canvas*/ canvas, /*ImageData*/ dataInput, /*String*/ mode = "hsl") {
/*233*/   let ctxOutput = canvas.getContext("2d");
/*234*/   const colWidth = 4;
/*235*/   const colMaxHeight = 128 * colWidth;
/*236*/   canvas.width = colWidth * 256;
/*237*/   canvas.height = colMaxHeight;
/*238*/   let histogram = GetHistogram(dataInput, mode);
/*239*/   //let maxBrightCount = Math.max.apply(null, histogram);
/*240*/   let maxValueCount = NumArrayFindMax(histogram);
/*241*/   //console.log(maxValueCount);
/*242*/   let tmp = colMaxHeight / maxValueCount;
/*243*/   //console.log("DrawHistogram");
/*244*/   //console.log(histogram);
/*245*/   ctxOutput.fillStyle = "rgba(255, 255, 255, 255)";
/*246*/   ctxOutput.fillRect(0, 0, 256 * colWidth, colMaxHeight);
/*247*/   if (mode == "r") {
/*248*/     ctxOutput.fillStyle = "rgba(255, 0, 0, 255)";
/*249*/   }
/*250*/   else if (mode == "g") {
/*251*/     ctxOutput.fillStyle = "rgba(0, 255, 0, 255)";
/*252*/   }
/*253*/   else if (mode == "b") {
/*254*/     ctxOutput.fillStyle = "rgba(0, 0, 255, 255)";
/*255*/   }
/*256*/   else {
/*257*/     ctxOutput.fillStyle = "rgba(0, 0, 0, 255)";
/*258*/   }
/*259*/   for (let i = 0; i < histogram.length; i++) {
/*260*/     ctxOutput.fillRect(i * colWidth, colMaxHeight, colWidth, -Math.floor(histogram[i] * tmp + Number.EPSILON));
/*261*/   }
/*262*/   canvas.title = mode + ". Max " + NumArrayFindMax(histogram).toString();
/*263*/   return histogram;
/*264*/ }
/*265*/ 
/*266*/ function ShowHistogramCanvas() {
/*267*/   document.getElementById("histogram-button").innerHTML = "Скрыть гистограмму";
/*268*/   let canvasHSL = document.getElementById("histogram-canvas-edited-hsl");
/*269*/   let ctx = canvasHSL.getContext("2d");
/*270*/   if (IsHistogramDirty(ctx.getImageData(0, 0, 1, 1))) {
/*271*/     let canvasEdit = document.getElementById("edited-img-canvas");
/*272*/     let dataEdit = canvasEdit.getContext("2d").getImageData(0, 0, canvasEdit.width, canvasEdit.height);
/*273*/     let canvases = new Array(3);
/*274*/     let modes = ["r", "g", "b"];
/*275*/     for (let i = 0; i < 3; i++) {
/*276*/       canvases[i] = document.getElementById("histogram-canvas-edited-" + modes[i]);
/*277*/       DrawHistogram(canvases[i], dataEdit, modes[i]);
/*278*/     }
/*279*/     DrawHistogram(canvasHSL, dataEdit, "hsl");
/*280*/   }
/*281*/   //canvas.style.display = "inline";
/*282*/   document.getElementById("histograms-table").style.display = "inline";
/*283*/ }
/*284*/ 
/*285*/ function DrawOriginalHistogramCanvas() {
/*286*/   let canvasOriginal = document.getElementById("original-img-canvas");
/*287*/   let dataOriginal = canvasOriginal.getContext("2d").getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
/*288*/   let canvases = new Array(4);
/*289*/   let modes = ["r", "g", "b", "hsl"];
/*290*/   for (let i = 0; i < 4; i++) {
/*291*/     canvases[i] = document.getElementById("histogram-canvas-original-" + modes[i]);
/*292*/     DrawHistogram(canvases[i], dataOriginal, modes[i]);
/*293*/   }
/*294*/ }
/*295*/ 
/*296*/ function HideHistogramCanvas() {
/*297*/   document.getElementById("histogram-button").innerHTML = "Показать гистограмму";
/*298*/   document.getElementById("histograms-table").style.display = "none";
/*299*/ }
/*300*/ 
/*301*/ function DirtHistogram(/*Canvas*/ canvas = document.getElementById("histogram-canvas-edited-hsl")) {
/*302*/   let ctx = canvas.getContext("2d");
/*303*/   let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
/*304*/   for (let i = 0; i < 4; i++) {
/*305*/     data.data[i] = 0;
/*306*/   }
/*307*/   ctx.putImageData(data, 0, 0);
/*308*/   HideHistogramCanvas();
/*309*/ }
/*310*/ 
/*311*/ function IsHistogramDirty(/*ImageData*/ data) {
/*312*/   return (data.data[0] == 0 && data.data[1] == 0 && data.data[2] == 0 && data.data[3] == 0);
/*313*/ }
/*314*/ 
/*315*/ function GetMatrixFromTextarea(/*String*/ str) {
/*316*/   if (str === '') {
/*317*/     let kernel = new Array(3);
/*318*/     for (let i = 0; i < 3; i++) {
/*319*/       kernel[i] = new Array(3);
/*320*/       for (let j = 0; j < 3; j++) {
/*321*/         if (i % 2 == 0 && j != 1) {
/*322*/           kernel[i][j] = 0;
/*323*/         }
/*324*/         else {
/*325*/           kernel[i][j] = 1;
/*326*/         }
/*327*/       }
/*328*/     }
/*329*/     return kernel;
/*330*/   }
/*331*/   let kernel = str.split('\n');
/*332*/   if (kernel.length % 2 == 0) {
/*333*/     // Becaue code from manual is not capable of processing matrices with even size.
/*334*/     SendErrorMessage("Матрица не может иметь чётный размер.", true);
/*335*/   }
/*336*/   for (let i = 0; i < kernel.length; i++) {
/*337*/     kernel[i] = kernel[i].split(' ');
/*338*/     if (kernel[i].length != kernel.length) {
/*339*/       SendErrorMessage("Матрица не квадратная.", true);
/*340*/     }
/*341*/     for (let j = 0; j < kernel.length; j++) {
/*342*/       kernel[i][j] = parseFloat(kernel[i][j]);
/*343*/       if (kernel[i][j] == NaN) {
/*344*/         SendErrorMessage("kernel[" + toString(i) + "][" + toString(j) + "] не число.", true);
/*345*/       }
/*346*/     }
/*347*/   }
/*348*/   return kernel;
/*349*/ }


// --------------------------------------------------------------------------------------------------------------------------------
// Compiled history.js
// --------------------------------------------------------------------------------------------------------------------------------

/*1*/ 
/*2*/ 
/*3*/ const historySize = 10;
/*4*/ 
/*5*/ class History {
/*6*/   constructor(/*Number*/ size) {
/*7*/     this.size = size;
/*8*/     this.i = -1;
/*9*/     this.count = 0;
/*10*/     this.data = [];
/*11*/     this.data.length = this.size;
/*12*/   }
/*13*/ 
/*14*/   IsFull() {
/*15*/     return this.count == this.size;
/*16*/   }
/*17*/ 
/*18*/   NextExist() {
/*19*/     return this.i + 1 < this.count;
/*20*/   }
/*21*/ 
/*22*/   PrevExist() {
/*23*/     return this.i - 1 >= 0;
/*24*/   }
/*25*/ 
/*26*/   Next() {
/*27*/     this.i++;
/*28*/   }
/*29*/ 
/*30*/   Prev() {
/*31*/     this.i--;
/*32*/   }
/*33*/ 
/*34*/   GetCurrent() {
/*35*/     return this.data[this.i];
/*36*/   }
/*37*/ 
/*38*/   Add(/*ImageData*/ data) {
/*39*/     this.DeleteAfterCurrent();
/*40*/     if (this.IsFull()) {
/*41*/       this.data.shift();
/*42*/       this.count--;
/*43*/     }
/*44*/     else {
/*45*/       this.i++;
/*46*/     }
/*47*/     this.data.push(data);
/*48*/     this.count++;
/*49*/   }
/*50*/ 
/*51*/   DeleteAfterCurrent() {
/*52*/     this.data.length = this.i + 1;
/*53*/     this.count = this.i + 1;
/*54*/   }
/*55*/ 
/*56*/   DeleteAll() {
/*57*/     this.data.length = 0;
/*58*/     this.count = 0;
/*59*/     this.i = -1;
/*60*/   }
/*61*/ }
/*62*/ 
/*63*/ let history = new History(historySize);
/*64*/ 
/*65*/ function HistoryUpdate() {
/*66*/   document.getElementById("history-next-button").disabled = !history.NextExist();
/*67*/   document.getElementById("history-prev-button").disabled = !history.PrevExist();
/*68*/   let canvas = document.getElementById("edited-img-canvas");
/*69*/   let ctx = canvas.getContext("2d");
/*70*/   ctx.putImageData(history.GetCurrent(), 0, 0);
/*71*/   HistoryLog();
/*72*/   DirtHistogram();
/*73*/ }
/*74*/ 
/*75*/ function HistoryAdd(/*ImageData*/ data) {
/*76*/   history.Add(CopyImageData(data));
/*77*/   //history.DeleteAfterCurrent();
/*78*/   document.getElementById("history-next-button").disabled = !history.NextExist();
/*79*/   document.getElementById("history-prev-button").disabled = !history.PrevExist();
/*80*/ }
/*81*/ 
/*82*/ function HistoryLog() {
/*83*/   console.info("History " + (history.i + 1).toString() + '/' + history.count.toString() + '/' + history.size.toString() + " (индекс/количество/размер).");
/*84*/ }


// --------------------------------------------------------------------------------------------------------------------------------
// Compiled filters-base.js
// --------------------------------------------------------------------------------------------------------------------------------

/*1*/ 
/*2*/ 
/*3*/ 
/*4*/ const parts = 100;
/*5*/ 
/*6*/ function ApplyPerPixelFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*functon*/ func, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*7*/   // func(r, g, b, a) -> [r, g, b, a]
/*8*/   ProgressBarInit();
/*9*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*10*/   let ctx = canvas.getContext("2d");
/*11*/   let completedProgress = 0;
/*12*/   const totalProgress = data.width * data.height;
/*13*/   let tmpCanvas = document.createElement("canvas");
/*14*/   tmpCanvas.width = canvas.width;
/*15*/   tmpCanvas.height = canvas.height;
/*16*/   let tmpCtx = tmpCanvas.getContext("2d");
/*17*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*18*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*19*/   const total = data.data.length;
/*20*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*21*/   let i = 0;
/*22*/   function ApplyPerPixelFilterUpdate() {
/*23*/     do {
/*24*/       let pixels = func(data.data[i + 0], data.data[i + 1], data.data[i + 2], data.data[i + 3]);
/*25*/       SetPixelImgDataByIndex(tmpData, i, pixels[0], pixels[1], pixels[2], pixels[3]);
/*26*/       i += 4;
/*27*/       completedProgress++;
/*28*/     } while (i % stopPart != 0 && i < total)
/*29*/     if (i < total) {
/*30*/       ProgressBarCallback(totalProgress, completedProgress);
/*31*/       setTimeout(ApplyPerPixelFilterUpdate);
/*32*/     }
/*33*/     else {
/*34*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*35*/       doAfter();
/*36*/     }
/*37*/   }
/*38*/   ApplyPerPixelFilterUpdate();
/*39*/ }
/*40*/ 
/*41*/ function ApplyMatrixFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ kernel, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*42*/   // kernel matrix with only odd size
/*43*/   ProgressBarInit();
/*44*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*45*/   let ctx = canvas.getContext("2d");
/*46*/   let completedProgress = 0;
/*47*/   const totalProgress = data.width * data.height;
/*48*/   let tmpCanvas = document.createElement("canvas");
/*49*/   tmpCanvas.width = canvas.width;
/*50*/   tmpCanvas.height = canvas.height;
/*51*/   let tmpCtx = tmpCanvas.getContext("2d");
/*52*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*53*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*54*/   const total = data.data.length;
/*55*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*56*/   let i = 0;
/*57*/   let radX = Math.floor(kernel.length / 2 + Number.EPSILON);
/*58*/   let radY = Math.floor(kernel[0].length / 2 + Number.EPSILON);
/*59*/   function ApplyMatrixFilterUpdate() {
/*60*/     do {
/*61*/       let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
/*62*/       let result = [0.0, 0.0, 0.0];
/*63*/       for (let l = -radY; l <= radY; l++) {
/*64*/         for (let k = -radX; k <= radX; k++) {
/*65*/           let idX = Clamp(x + k, 0, data.width - 1);
/*66*/           let idY = Clamp(y + l, 0, data.height - 1);
/*67*/           let nColor = GetMatrixColorFromImgData(data, idX, idY);
/*68*/           for (let j = 0; j < 3; j++) {
/*69*/             result[j] += nColor[j] * kernel[k + radX][l + radY];
/*70*/           }
/*71*/         }
/*72*/       }
/*73*/       SetPixelImgDataByIndex(tmpData, i, result[0], result[1], result[2], data.data[i + 3]);
/*74*/       i += 4;
/*75*/       completedProgress++;
/*76*/     } while (i % stopPart != 0 && i < total)
/*77*/     if (i < total) {
/*78*/       ProgressBarCallback(totalProgress, completedProgress);
/*79*/       setTimeout(ApplyMatrixFilterUpdate);
/*80*/     }
/*81*/     else {
/*82*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*83*/       doAfter();
/*84*/     }
/*85*/   }
/*86*/   ApplyMatrixFilterUpdate();
/*87*/ }
/*88*/ 
/*89*/ function ApplyGeometryFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*functon*/ func, /*bool*/ startWithEmptyCanvas = true, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*90*/   // func(k, l) -> [ x, y ]
/*91*/   ProgressBarInit();
/*92*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*93*/   let ctx = canvas.getContext("2d");
/*94*/   let completedProgress = 0;
/*95*/   const totalProgress = data.width * data.height;
/*96*/   let tmpCanvas = document.createElement("canvas");
/*97*/   tmpCanvas.width = canvas.width;
/*98*/   tmpCanvas.height = canvas.height;
/*99*/   let tmpCtx = tmpCanvas.getContext("2d");
/*100*/   if (startWithEmptyCanvas) {
/*101*/     tmpCtx.fillStyle = "rgba(0, 0, 0, 255)";
/*102*/     tmpCtx.fillRect(0, 0, canvas.width, canvas.height);
/*103*/   }
/*104*/   else {
/*105*/     tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*106*/   }
/*107*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*108*/   const total = data.data.length;
/*109*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*110*/   let i = 0;
/*111*/   function ApplyGeometryFilterUpdate() {
/*112*/     do {
/*113*/       let [k, l] = GetMatrixIndexFromImgDataIndex(data, i);
/*114*/       let [x, y] = func(k, l);
/*115*/       if (x >= 0 && y >= 0 && x < data.width && y < data.height) {
/*116*/         let j = GetImgDataIndexFromMatrixIndex(data, x, y);
/*117*/         //SetPixelImgData(tmpData, x, y, data.data[i+0], data.data[i+1], data.data[i+2], data.data[i+3]);
/*118*/         SetPixelImgDataByIndex(tmpData, i, data.data[j + 0], data.data[j + 1], data.data[j + 2], data.data[j + 3]);
/*119*/       }
/*120*/       i += 4;
/*121*/       completedProgress++;
/*122*/     } while (i % stopPart != 0 && i < total)
/*123*/     if (i < total) {
/*124*/       ProgressBarCallback(totalProgress, completedProgress);
/*125*/       setTimeout(ApplyGeometryFilterUpdate);
/*126*/     }
/*127*/     else {
/*128*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*129*/       doAfter();
/*130*/     }
/*131*/   }
/*132*/   ApplyGeometryFilterUpdate();
/*133*/ }
/*134*/ 
/*135*/ function ApplyDialation(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix bool*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*136*/   // mask matrix with only odd size
/*137*/   ProgressBarInit();
/*138*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*139*/   let ctx = canvas.getContext("2d");
/*140*/   let completedProgress = 0;
/*141*/   const totalProgress = data.width * data.height;
/*142*/   let tmpCanvas = document.createElement("canvas");
/*143*/   tmpCanvas.width = canvas.width;
/*144*/   tmpCanvas.height = canvas.height;
/*145*/   let tmpCtx = tmpCanvas.getContext("2d");
/*146*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*147*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*148*/   const total = data.data.length;
/*149*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*150*/   let i = 0;
/*151*/   let radX = Math.floor(mask.length / 2 + Number.EPSILON);
/*152*/   let radY = Math.floor(mask[0].length / 2 + Number.EPSILON);
/*153*/   function ApplyDialationUpdate() {
/*154*/     do {
/*155*/       let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
/*156*/       let max = [0, 0, 0];
/*157*/       for (let l = -radY; l <= radY; l++) {
/*158*/         for (let k = -radX; k <= radX; k++) {
/*159*/           let idX = Clamp(x + k, 0, data.width - 1);
/*160*/           let idY = Clamp(y + l, 0, data.height - 1);
/*161*/           if ((mask[k + radX][l + radY])) {
/*162*/             let cmpIndex = GetImgDataIndexFromMatrixIndex(data, idX, idY);
/*163*/             if (((data.data[cmpIndex + 0] + data.data[cmpIndex + 1] + data.data[cmpIndex + 2]) / 3) > ((max[0] + max[1] + max[2]) / 3)) {
/*164*/               max[0] = data.data[cmpIndex + 0];
/*165*/               max[1] = data.data[cmpIndex + 1];
/*166*/               max[2] = data.data[cmpIndex + 2];
/*167*/             }
/*168*/             //for (let t = 0; t < 3; t++) {
/*169*/             //  if (data.data[cmpIndex+t] > max[t]) {
/*170*/             //    max[t] = data.data[cmpIndex+t];
/*171*/             //  }
/*172*/             //}
/*173*/           }
/*174*/         }
/*175*/       }
/*176*/       SetPixelImgDataByIndex(tmpData, i, max[0], max[1], max[2], data.data[i + 3]);
/*177*/       i += 4;
/*178*/       completedProgress++;
/*179*/     } while (i % stopPart != 0 && i < total)
/*180*/     if (i < total) {
/*181*/       ProgressBarCallback(totalProgress, completedProgress);
/*182*/       setTimeout(ApplyDialationUpdate);
/*183*/     }
/*184*/     else {
/*185*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*186*/       doAfter();
/*187*/     }
/*188*/   }
/*189*/   ApplyDialationUpdate();
/*190*/ }
/*191*/ 
/*192*/ function ApplyErosion(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*193*/   // mask matrix with only odd size
/*194*/   ProgressBarInit();
/*195*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*196*/   let ctx = canvas.getContext("2d");
/*197*/   let completedProgress = 0;
/*198*/   const totalProgress = data.width * data.height;
/*199*/   let tmpCanvas = document.createElement("canvas");
/*200*/   tmpCanvas.width = canvas.width;
/*201*/   tmpCanvas.height = canvas.height;
/*202*/   let tmpCtx = tmpCanvas.getContext("2d");
/*203*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*204*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*205*/   const total = data.data.length;
/*206*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*207*/   let i = 0;
/*208*/   let radX = Math.floor(mask.length / 2 + Number.EPSILON);
/*209*/   let radY = Math.floor(mask[0].length / 2 + Number.EPSILON);
/*210*/   function ApplyDialationUpdate() {
/*211*/     do {
/*212*/       let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
/*213*/       let min = [255, 255, 255];
/*214*/       for (let l = -radY; l <= radY; l++) {
/*215*/         for (let k = -radX; k <= radX; k++) {
/*216*/           let idX = Clamp(x + k, 0, data.width - 1);
/*217*/           let idY = Clamp(y + l, 0, data.height - 1);
/*218*/           if ((mask[k + radX][l + radY])) {
/*219*/             let cmpIndex = GetImgDataIndexFromMatrixIndex(data, idX, idY);
/*220*/             if (((data.data[cmpIndex + 0] + data.data[cmpIndex + 1] + data.data[cmpIndex + 2]) / 3) < ((min[0] + min[1] + min[2]) / 3)) {
/*221*/               min[0] = data.data[cmpIndex + 0];
/*222*/               min[1] = data.data[cmpIndex + 1];
/*223*/               min[2] = data.data[cmpIndex + 2];
/*224*/             }
/*225*/             //for (let t = 0; t < 3; t++) {
/*226*/             //  if (data.data[cmpIndex+t] > min[t]) {
/*227*/             //    min[t] = data.data[cmpIndex+t];
/*228*/             //  }
/*229*/             //}
/*230*/           }
/*231*/         }
/*232*/       }
/*233*/       SetPixelImgDataByIndex(tmpData, i, min[0], min[1], min[2], data.data[i + 3]);
/*234*/       i += 4;
/*235*/       completedProgress++;
/*236*/     } while (i % stopPart != 0 && i < total)
/*237*/     if (i < total) {
/*238*/       ProgressBarCallback(totalProgress, completedProgress);
/*239*/       setTimeout(ApplyDialationUpdate);
/*240*/     }
/*241*/     else {
/*242*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*243*/       doAfter();
/*244*/     }
/*245*/   }
/*246*/   ApplyDialationUpdate();
/*247*/ }
/*248*/ 
/*249*/ function ApplyOpening(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*250*/   ApplyErosion(canvas, data, mask, false, function () {
/*251*/     // Need to renew
/*252*/     let ctx = canvas.getContext("2d");
/*253*/     let [x, y, w, h] = GetOffsetFromElement(canvas);
/*254*/     ApplyDialation(canvas, ctx.getImageData(x, y, w, h), mask, doHistoryAdd, doAfter);
/*255*/   });
/*256*/ }
/*257*/ 
/*258*/ function ApplyClosing(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*259*/   ApplyDialation(canvas, data, mask, false, function () {
/*260*/     // Need to renew
/*261*/     let ctx = canvas.getContext("2d");
/*262*/     let [x, y, w, h] = GetOffsetFromElement(canvas);
/*263*/     ApplyErosion(canvas, ctx.getImageData(x, y, w, h), mask, doHistoryAdd, doAfter);
/*264*/   });
/*265*/ }
/*266*/ 
/*267*/ function ApplyGrad(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*268*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*269*/   let ctx = canvas.getContext("2d");
/*270*/   let tmpCanvases = new Array(2);
/*271*/   for (let i = 0; i < 2; i++) {
/*272*/     tmpCanvases[i] = document.createElement("canvas");
/*273*/     tmpCanvases[i].width = canvas.width;
/*274*/     tmpCanvases[i].height = canvas.height;
/*275*/     let tmpCtx = tmpCanvases[i].getContext("2d");
/*276*/     tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*277*/     //tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*278*/   }
/*279*/   ApplyDialation(tmpCanvases[0], data, mask, false, function () {
/*280*/     ApplyErosion(tmpCanvases[1], data, mask, false, function () {
/*281*/       let tmpDatas = new Array(2);
/*282*/       for (let i = 0; i < 2; i++) {
/*283*/         let tmpCtx = tmpCanvases[i].getContext("2d");
/*284*/         tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*285*/       }
/*286*/       ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], SubtractColors, doHistoryAdd, doAfter);
/*287*/     });
/*288*/   });
/*289*/ }
/*290*/ 
/*291*/ function ApplyTopHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*292*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*293*/   let ctx = canvas.getContext("2d");
/*294*/   let tmpCanvas = document.createElement("canvas");
/*295*/   tmpCanvas.width = canvas.width;
/*296*/   tmpCanvas.height = canvas.height;
/*297*/   let tmpCtx = tmpCanvas.getContext("2d");
/*298*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*299*/   ApplyClosing(tmpCanvas, data, mask, false, function () {
/*300*/     let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*301*/     ApplyDataPerPixelOperator(canvas, data, tmpData, SubtractColors, doHistoryAdd, doAfter);
/*302*/   });
/*303*/ 
/*304*/ }
/*305*/ 
/*306*/ function ApplyBlackHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Matrix*/ mask, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*307*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*308*/   let ctx = canvas.getContext("2d");
/*309*/   let tmpCanvas = document.createElement("canvas");
/*310*/   tmpCanvas.width = canvas.width;
/*311*/   tmpCanvas.height = canvas.height;
/*312*/   let tmpCtx = tmpCanvas.getContext("2d");
/*313*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*314*/   ApplyOpening(tmpCanvas, data, mask, false, function () {
/*315*/     let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*316*/     ApplyDataPerPixelOperator(canvas, tmpData, data, SubtractColors, doHistoryAdd, doAfter);
/*317*/   });
/*318*/ }
/*319*/ 
/*320*/ function ApplyMedianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Integer*/ rad, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*321*/   ProgressBarInit();
/*322*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*323*/   let ctx = canvas.getContext("2d");
/*324*/   let completedProgress = 0;
/*325*/   const totalProgress = data.width * data.height;
/*326*/   let tmpCanvas = document.createElement("canvas");
/*327*/   tmpCanvas.width = canvas.width;
/*328*/   tmpCanvas.height = canvas.height;
/*329*/   let tmpCtx = tmpCanvas.getContext("2d");
/*330*/   tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*331*/   let tmpData = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*332*/   const total = data.data.length;
/*333*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*334*/   let i = 0;
/*335*/   let radX = rad;
/*336*/   let radY = rad;
/*337*/   function ApplyMedianFilterUpdate() {
/*338*/     do {
/*339*/       let [x, y] = GetMatrixIndexFromImgDataIndex(data, i);
/*340*/       let arrR = [];
/*341*/       let arrG = [];
/*342*/       let arrB = [];
/*343*/       for (let l = -radY; l <= radY; l++) {
/*344*/         for (let k = -radX; k <= radX; k++) {
/*345*/           let idX = Clamp(x + k, 0, data.width - 1);
/*346*/           let idY = Clamp(y + l, 0, data.height - 1);
/*347*/           let nColor = GetMatrixColorFromImgData(data, idX, idY);
/*348*/           arrR.push(nColor[0]);
/*349*/           arrG.push(nColor[1]);
/*350*/           arrB.push(nColor[2]);
/*351*/         }
/*352*/       }
/*353*/       function InSort(a, b) {
/*354*/         return a - b;
/*355*/       }
/*356*/       arrR.sort(InSort);
/*357*/       arrG.sort(InSort);
/*358*/       arrB.sort(InSort);
/*359*/       let resInds = [Math.floor(arrR.length / 2 + Number.EPSILON), Math.floor(arrG.length / 2 + Number.EPSILON), Math.floor(arrB.length / 2 + Number.EPSILON)];
/*360*/       SetPixelImgDataByIndex(tmpData, i, arrR[resInds[0]], arrG[resInds[1]], arrB[resInds[2]], data.data[i + 3]);
/*361*/       i += 4;
/*362*/       completedProgress++;
/*363*/     } while (i % stopPart != 0 && i < total)
/*364*/     if (i < total) {
/*365*/       ProgressBarCallback(totalProgress, completedProgress);
/*366*/       setTimeout(ApplyMedianFilterUpdate);
/*367*/     }
/*368*/     else {
/*369*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*370*/       doAfter();
/*371*/     }
/*372*/   }
/*373*/   ApplyMedianFilterUpdate();
/*374*/ }
/*375*/ 
/*376*/ function ApplyDataPerPixelOperator(/*Canvas*/ canvas, /*ImageData*/ data1, /*ImageData*/ data2, /*functon*/ func, doHistoryAdd = true, /*functon*/ doAfter = function () { }) {
/*377*/   // func(colors1, colors2) -> [r, g, b, a]
/*378*/   if (data1.data.length != data2.data.length || data1.width != data2.width || data1.height != data2.height) {
/*379*/     SendErrorMessage("Размеры data1 и data2 разные.", true);
/*380*/   }
/*381*/   ProgressBarInit();
/*382*/   let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*383*/   let ctx = canvas.getContext("2d");
/*384*/   let completedProgress = 0;
/*385*/   const totalProgress = data1.width * data1.height;
/*386*/   let tmpCanvas = document.createElement("canvas");
/*387*/   tmpCanvas.width = canvas.width;
/*388*/   tmpCanvas.height = canvas.height;
/*389*/   let tmpCtx = tmpCanvas.getContext("2d");
/*390*/   tmpCtx.fillStyle = "rgba(0, 0, 0, 255)";
/*391*/   tmpCtx.fillRect(0, 0, canvas.width, canvas.height);
/*392*/   let tmpData = tmpCtx.getImageData(offX, offY, data1.width, data1.height);
/*393*/   const total = data1.data.length;
/*394*/   const stopPart = Math.floor(total / parts + Number.EPSILON);
/*395*/   let i = 0;
/*396*/   function ApplyDataPerPixelOperatorUpdate() {
/*397*/     do {
/*398*/       let pixels = func([data1.data[i + 0], data1.data[i + 1], data1.data[i + 2], data1.data[i + 3]], [data2.data[i + 0], data2.data[i + 1], data2.data[i + 2], data2.data[i + 3]]);
/*399*/       SetPixelImgDataByIndex(tmpData, i, pixels[0], pixels[1], pixels[2], pixels[3]);
/*400*/       i += 4;
/*401*/       completedProgress++;
/*402*/     } while (i % stopPart != 0 && i < total)
/*403*/     if (i < total) {
/*404*/       ProgressBarCallback(totalProgress, completedProgress);
/*405*/       setTimeout(ApplyDataPerPixelOperatorUpdate);
/*406*/     }
/*407*/     else {
/*408*/       ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd);
/*409*/       doAfter();
/*410*/     }
/*411*/   }
/*412*/   ApplyDataPerPixelOperatorUpdate();
/*413*/ }
/*414*/ 
/*415*/ function ApplyFilterLastStep(tmpCanvas, ctx, tmpData, offX, offY, doHistoryAdd = true) {
/*416*/   ctx.putImageData(tmpData, offX, offY);
/*417*/   if (doHistoryAdd) {
/*418*/     HistoryAdd(ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height));
/*419*/     HistoryLog();
/*420*/   }
/*421*/   tmpCanvas.remove();
/*422*/   ProgressBarReset();
/*423*/   document.getElementById("reset-button").disabled = false;
/*424*/   DirtHistogram();
/*425*/ }


// --------------------------------------------------------------------------------------------------------------------------------
// Compiled filters.js
// --------------------------------------------------------------------------------------------------------------------------------

/*1*/ 
/*2*/ 
/*3*/ 
/*4*/ const oneFilterDictTest = {
/*5*/   "(тест)": {
/*6*/     "args": {
/*7*/       "Тип": {
/*8*/         "label": "Тип",
/*9*/         "type": "select",
/*10*/         "values": [
/*11*/           "По x", "По y", "Оба + среднее арифметическое", "Оба + среднее квадратичное",
/*12*/         ],
/*13*/       },
/*14*/       "test2": {
/*15*/         "label": "test3",
/*16*/         "type": "input",
/*17*/         "input-type": "checkbox",
/*18*/         "checked": false,
/*19*/         "value": ""
/*20*/       },
/*21*/       "default text": {
/*22*/         "label": "default txt",
/*23*/         "type": "input",
/*24*/         "input-type": "text",
/*25*/         "value": ""
/*26*/       },
/*27*/       "big textarea": {
/*28*/         "label": "Бинарная матрица",
/*29*/         "type": "textarea",
/*30*/         "placeholder": "Напишите что-нибудь",
/*31*/         "value": "",
/*32*/       },
/*33*/     },
/*34*/     "func": NaNFilter,
/*35*/   },
/*36*/ }
/*37*/ 
/*38*/ let filtersDict = {
/*39*/   "NaN": null,
/*40*/   "Поточечные фильтры": null,
/*41*/   "Инверсия": {
/*42*/     "args": {},
/*43*/     "func": DoInverseFilter,
/*44*/   },
/*45*/   "Чёрно-белое": {
/*46*/     "args": {},
/*47*/     "func": DoGrayScaleFilter,
/*48*/   },
/*49*/   "Сепия": {
/*50*/     "args": {
/*51*/       "k": {
/*52*/         "label": "Коэффициент",
/*53*/         "type": "input",
/*54*/         "input-type": "number",
/*55*/         "value": "25",
/*56*/       },
/*57*/     },
/*58*/     "func": DoSepiaFilter,
/*59*/   },
/*60*/   "Увеличение яркости": {
/*61*/     "args": {
/*62*/       "k": {
/*63*/         "label": "Коэффициент",
/*64*/         "type": "input",
/*65*/         "input-type": "number",
/*66*/         "value": "50",
/*67*/       },
/*68*/     },
/*69*/     "func": DoIncreaseBrightnessPerPixelFilter,
/*70*/   },
/*71*/   "Матричные фильтры": null,
/*72*/   "Своя матрица": {
/*73*/     "args": {
/*74*/       "matrix": {
/*75*/         "label": "Матрица",
/*76*/         "type": "textarea",
/*77*/         "placeholder": "Введите квадратную матрицу нечётного размера, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*78*/         "value": "",
/*79*/       },
/*80*/     },
/*81*/     "func": DoOwnMatrixFilter,
/*82*/   },
/*83*/   "Резкость": {
/*84*/     "args": {},
/*85*/     "func": DoSharpenFilter,
/*86*/   },
/*87*/   "Простой блюр": {
/*88*/     "args": {},
/*89*/     "func": DoSimpleBlur,
/*90*/   },
/*91*/   "Фильтр Гаусса (блюр)": {
/*92*/     "args": {
/*93*/       "r": {
/*94*/         "label": "Радиус > 0 ",
/*95*/         "type": "input",
/*96*/         "input-type": "number",
/*97*/         "value": "3",
/*98*/       },
/*99*/       "s": {
/*100*/         "label": "Сигма > 0 ",
/*101*/         "type": "input",
/*102*/         "input-type": "number",
/*103*/         "value": "2",
/*104*/       },
/*105*/     },
/*106*/     "func": DoGaussianFilter,
/*107*/   },
/*108*/   "Оператор Собеля": {
/*109*/     "args": {
/*110*/       "type": {
/*111*/         "label": "Тип",
/*112*/         "type": "select",
/*113*/         "values": [
/*114*/           "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
/*115*/         ],
/*116*/       },
/*117*/     },
/*118*/     "func": DoSobelOperator,
/*119*/   },
/*120*/   "Оператор Щарра": {
/*121*/     "args": {
/*122*/       "type": {
/*123*/         "label": "Тип",
/*124*/         "type": "select",
/*125*/         "values": [
/*126*/           "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
/*127*/         ],
/*128*/       },
/*129*/     },
/*130*/     "func": DoScharrOperator,
/*131*/   },
/*132*/   "Оператор Прюитта": {
/*133*/     "args": {
/*134*/       "type": {
/*135*/         "label": "Тип",
/*136*/         "type": "select",
/*137*/         "values": [
/*138*/           "По x", "По y", "Оба (среднее арифметическое)", "Оба (среднее квадратичное)",
/*139*/         ],
/*140*/       },
/*141*/     },
/*142*/     "func": DoPrewittOperator,
/*143*/   },
/*144*/   "Геометрические преобразования": null,
/*145*/   "Перенос": {
/*146*/     "args": {
/*147*/       "x": {
/*148*/         "label": "dx",
/*149*/         "type": "input",
/*150*/         "input-type": "number",
/*151*/         "value": "0",
/*152*/       },
/*153*/       "y": {
/*154*/         "label": "dy",
/*155*/         "type": "input",
/*156*/         "input-type": "number",
/*157*/         "value": "0",
/*158*/       },
/*159*/     },
/*160*/     "func": DoShiftFilter,
/*161*/   },
/*162*/   "Поворот": {
/*163*/     "args": {
/*164*/       "Центр поворота (x0, y0)": null,
/*165*/       "x0": {
/*166*/         "label": "x0",
/*167*/         "type": "input",
/*168*/         "input-type": "number",
/*169*/         "value": "0",
/*170*/       },
/*171*/       "y0": {
/*172*/         "label": "y0",
/*173*/         "type": "input",
/*174*/         "input-type": "number",
/*175*/         "value": "0",
/*176*/       },
/*177*/       "angle": {
/*178*/         "label": "Угол поворота (градусы)",
/*179*/         "type": "input",
/*180*/         "input-type": "number",
/*181*/         "value": "0",
/*182*/       }
/*183*/     },
/*184*/     "func": DoRotateFilter,
/*185*/   },
/*186*/   "Волна 1": {
/*187*/     "args": {},
/*188*/     "func": DoWave1Filter,
/*189*/   },
/*190*/   "Волна 2": {
/*191*/     "args": {},
/*192*/     "func": DoWave2Filter,
/*193*/   },
/*194*/   "Эффект стекла": {
/*195*/     "args": {},
/*196*/     "func": DoGlassEffectFilter,
/*197*/   },
/*198*/   "Операции мат морфологии": null,
/*199*/   "Расширение (dialation)": {
/*200*/     "args": {
/*201*/       "matrix": {
/*202*/         "label": "Бинарная матрица",
/*203*/         "type": "textarea",
/*204*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*205*/         "value": "",
/*206*/       },
/*207*/     },
/*208*/     "func": DoDialation,
/*209*/   },
/*210*/   "Сужение (erosion)": {
/*211*/     "args": {
/*212*/       "matrix": {
/*213*/         "label": "Бинарная матрица",
/*214*/         "type": "textarea",
/*215*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*216*/         "value": "",
/*217*/       },
/*218*/     },
/*219*/     "func": DoErosion,
/*220*/   },
/*221*/   "Открытие (opening)": {
/*222*/     "args": {
/*223*/       "matrix": {
/*224*/         "label": "Бинарная матрица",
/*225*/         "type": "textarea",
/*226*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*227*/         "value": "",
/*228*/       },
/*229*/     },
/*230*/     "func": DoOpening,
/*231*/   },
/*232*/   "Закрытие (closing)": {
/*233*/     "args": {
/*234*/       "matrix": {
/*235*/         "label": "Бинарная матрица",
/*236*/         "type": "textarea",
/*237*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*238*/         "value": "",
/*239*/       },
/*240*/     },
/*241*/     "func": DoClosing,
/*242*/   },
/*243*/   "Градиент": {
/*244*/     "args": {
/*245*/       "matrix": {
/*246*/         "label": "Бинарная матрица",
/*247*/         "type": "textarea",
/*248*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*249*/         "value": "",
/*250*/       },
/*251*/     },
/*252*/     "func": DoGrad,
/*253*/   },
/*254*/   "Top hat": {
/*255*/     "args": {
/*256*/       "matrix": {
/*257*/         "label": "Бинарная матрица",
/*258*/         "type": "textarea",
/*259*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*260*/         "value": "",
/*261*/       },
/*262*/     },
/*263*/     "func": DoTopHat,
/*264*/   },
/*265*/   "Black hat": {
/*266*/     "args": {
/*267*/       "matrix": {
/*268*/         "label": "Бинарная матрица",
/*269*/         "type": "textarea",
/*270*/         "placeholder": "Введите квадратную матрицу нечётного размера с бинарными элементами, разделяя элементы пробелами и новой строкой... По умолчанию: 'крест' 3x3.",
/*271*/         "value": "",
/*272*/       },
/*273*/     },
/*274*/     "func": DoBlackHat,
/*275*/   },
/*276*/   "Медианный фильтр": {
/*277*/     "args": {
/*278*/       "r": {
/*279*/         "label": "Радиус > 0<br>Размер=радиус*2+1",
/*280*/         "type": "input",
/*281*/         "input-type": "number",
/*282*/         "value": "1",
/*283*/       },
/*284*/     },
/*285*/     "func": DoMedianFilter,
/*286*/   },
/*287*/   "Цветокоррекции": null,
/*288*/   "Линейная коррекция": {
/*289*/     "args": {},
/*290*/     "func": DoLinearCorrection,
/*291*/   },
/*292*/   "Гамма-коррекция": {
/*293*/     "args": {
/*294*/       "c": {
/*295*/         "label": "Константа 'c' > 0 ",
/*296*/         "type": "input",
/*297*/         "input-type": "number",
/*298*/         "value": "1",
/*299*/       },
/*300*/       "gam": {
/*301*/         "label": "Гамма > 0 ",
/*302*/         "type": "input",
/*303*/         "input-type": "number",
/*304*/         "value": "0.45",
/*305*/       },
/*306*/     },
/*307*/     "func": DoGammaCorrection,
/*308*/   },
/*309*/   "Логарифмическая коррекция": {
/*310*/     "args": {
/*311*/       "c": {
/*312*/         "label": "Константа 'c' > 0 ",
/*313*/         "type": "input",
/*314*/         "input-type": "number",
/*315*/         "value": "15",
/*316*/       },
/*317*/     },
/*318*/     "func": DoLogCorrection,
/*319*/   },
/*320*/   "Серый мир": {
/*321*/     "args": {},
/*322*/     "func": DoGreyWorld,
/*323*/   },
/*324*/   "Идеальный отражатель": {
/*325*/     "args": {},
/*326*/     "func": DoPerfectReflector,
/*327*/   },
/*328*/   "Коррекция с опорным цветом": {
/*329*/     "args": {
/*330*/       "Введите цвет (0-255)": null,
/*331*/       "r1": {
/*332*/         "label": "R",
/*333*/         "type": "input",
/*334*/         "input-type": "number",
/*335*/         "value": "0",
/*336*/       },
/*337*/       "g1": {
/*338*/         "label": "G",
/*339*/         "type": "input",
/*340*/         "input-type": "number",
/*341*/         "value": "0",
/*342*/       },
/*343*/       "b1": {
/*344*/         "label": "B",
/*345*/         "type": "input",
/*346*/         "input-type": "number",
/*347*/         "value": "0",
/*348*/       },
/*349*/     },
/*350*/     "Введите правильный для него цвет (0-255)": null,
/*351*/     "r2": {
/*352*/       "label": "R",
/*353*/       "type": "input",
/*354*/       "input-type": "number",
/*355*/       "value": "0",
/*356*/     },
/*357*/     "g2": {
/*358*/       "label": "G",
/*359*/       "type": "input",
/*360*/       "input-type": "number",
/*361*/       "value": "0",
/*362*/     },
/*363*/     "b2": {
/*364*/       "label": "B",
/*365*/       "type": "input",
/*366*/       "input-type": "number",
/*367*/       "value": "0",
/*368*/     },
/*369*/     "func": DoColorMappingCorrection,
/*370*/   }
/*371*/ };
/*372*/ 
/*373*/ function FiltersInit() {
/*374*/   let dropdowns = document.getElementById("select-filter");
/*375*/   // https://stackoverflow.com/a/34913701
/*376*/   Object.keys(filtersDict).forEach(function (key) {
/*377*/     if (key != "NaN") {
/*378*/       let e = document.createElement('option');
/*379*/       if (filtersDict[key] != null) {
/*380*/         e.value = key;
/*381*/       }
/*382*/       else {
/*383*/         e.disabled = true;
/*384*/         e.value = "";
/*385*/       }
/*386*/       e.innerHTML = key;
/*387*/       dropdowns.appendChild(e);
/*388*/     }
/*389*/   });
/*390*/ }
/*391*/ 
/*392*/ // forgor to use it bruh. who cares?
/*393*/ function GetFilterProperties(/*String*/ filter) {
/*394*/   if (!(filter in Object.keys(filtersDict)))
/*395*/     return filtersDict["NaN"];
/*396*/   return filtersDict[filter];
/*397*/ }
/*398*/ 
/*399*/ function NaNFilter(/*Canvas*/ canvas = null, /*ImageData*/ data = null, /*Dict*/ arg = {}) {
/*400*/   SendErrorMessage("NaN фильтр. Этот фильтр ещё не готов (или это вообще тестовый фильтр).", true);
/*401*/   return;
/*402*/ }
/*403*/ 
/*404*/ function DoInverseFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*405*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*406*/     return [255 - r, 255 - g, 255 - b, a];
/*407*/   });
/*408*/ }
/*409*/ 
/*410*/ function DoGrayScaleFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*411*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*412*/     let intens = 0.36 * r + 0.53 * g + 0.11 * b;
/*413*/     return [intens, intens, intens, a];
/*414*/   });
/*415*/ }
/*416*/ 
/*417*/ function DoSepiaFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*418*/   let k = Number(arg["k"]["val"]);
/*419*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*420*/     let intens = 0.36 * r + 0.53 * g + 0.11 * b;
/*421*/     return [intens + 2 * k, intens + 0.5 * k, intens - k, a];
/*422*/   });
/*423*/ }
/*424*/ 
/*425*/ function DoIncreaseBrightnessPerPixelFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*426*/   let k = Number(arg["k"]["val"]);
/*427*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*428*/     return [r + k, g + k, b + k, a];
/*429*/   });
/*430*/ }
/*431*/ 
/*432*/ function DoOwnMatrixFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*433*/   let kernel = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*434*/   ApplyMatrixFilter(canvas, data, kernel);
/*435*/ }
/*436*/ 
/*437*/ function DoSharpenFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*438*/   let kernel = new Array(3);
/*439*/   for (let i = 0; i < 3; i++) {
/*440*/     kernel[i] = new Array(3);
/*441*/     for (let j = 0; j < 3; j++) {
/*442*/       kernel[i][j] = -1.0;
/*443*/     }
/*444*/   }
/*445*/   kernel[1][1] = 9.0;
/*446*/   ApplyMatrixFilter(canvas, data, kernel);
/*447*/ }
/*448*/ 
/*449*/ function DoSimpleBlur(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*450*/   let kernel = new Array(3);
/*451*/   for (let i = 0; i < 3; i++) {
/*452*/     kernel[i] = new Array(3);
/*453*/     for (let j = 0; j < 3; j++) {
/*454*/       kernel[i][j] = 1.0 / 9.0;
/*455*/     }
/*456*/   }
/*457*/   ApplyMatrixFilter(canvas, data, kernel);
/*458*/ }
/*459*/ 
/*460*/ function DoGaussianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*461*/   let radius = Number(arg["r"]["val"]);
/*462*/   if (radius <= 0) {
/*463*/     SendErrorMessage("Радиус должен быть > 0.", true);
/*464*/   }
/*465*/   let sigma = parseFloat(arg["s"]["val"]);
/*466*/   if (sigma <= 0.0 + Number.EPSILON) {
/*467*/     SendErrorMessage("Сигма должна быть > 0.", true);
/*468*/   }
/*469*/   let kernel = CreateGaussianKernel(radius, sigma);
/*470*/   ApplyMatrixFilter(canvas, data, kernel);
/*471*/ }
/*472*/ 
/*473*/ function DoSobelOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*474*/   if (arg["type"]["val"] > 3) {
/*475*/     SendErrorMessage("Выбрано значение за пределом списка.", true);
/*476*/   }
/*477*/   let kernelX = new Array(3);
/*478*/   let kernelY = new Array(3);
/*479*/   for (let i = 0; i < 3; i++) {
/*480*/     kernelX[i] = new Array(3);
/*481*/     kernelY[i] = new Array(3);
/*482*/   }
/*483*/   for (let i = 0; i < 3; i++) {
/*484*/     for (let j = 0; j < 3; j++) {
/*485*/       if (j == 0) {
/*486*/         kernelX[i][j] = -1;
/*487*/         kernelY[j][i] = -1;
/*488*/       }
/*489*/       else if (j == 1) {
/*490*/         kernelX[i][j] = 0;
/*491*/         kernelY[j][i] = 0;
/*492*/       }
/*493*/       else if (j == 2) {
/*494*/         kernelX[i][j] = 1;
/*495*/         kernelY[j][i] = 1;
/*496*/       }
/*497*/     }
/*498*/   }
/*499*/   kernelX[1][0] = -2;
/*500*/   kernelY[0][1] = -2;
/*501*/   kernelX[1][2] = 2;
/*502*/   kernelY[2][1] = 2;
/*503*/   if (arg["type"]["val"] === 0) {
/*504*/     ApplyMatrixFilter(canvas, data, kernelX);
/*505*/   }
/*506*/   else if (arg["type"]["val"] === 1) {
/*507*/     ApplyMatrixFilter(canvas, data, kernelY);
/*508*/   }
/*509*/   else {
/*510*/     let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*511*/     let ctx = canvas.getContext("2d");
/*512*/     let tmpCanvases = new Array(2);
/*513*/     for (let i = 0; i < 2; i++) {
/*514*/       tmpCanvases[i] = document.createElement("canvas");
/*515*/       tmpCanvases[i].width = canvas.width;
/*516*/       tmpCanvases[i].height = canvas.height;
/*517*/       let tmpCtx = tmpCanvases[i].getContext("2d");
/*518*/       tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*519*/     }
/*520*/     ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
/*521*/       ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
/*522*/         let tmpDatas = new Array(2);
/*523*/         for (let i = 0; i < 2; i++) {
/*524*/           let tmpCtx = tmpCanvases[i].getContext("2d");
/*525*/           tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*526*/         }
/*527*/         if (arg["type"]["val"] === 2) {
/*528*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
/*529*/         }
/*530*/         else if (arg["type"]["val"] === 3) {
/*531*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
/*532*/         }
/*533*/         else {
/*534*/           SendErrorMessage("Выбрано значение за пределом списка.", true);
/*535*/         }
/*536*/       });
/*537*/     });
/*538*/   }
/*539*/ }
/*540*/ 
/*541*/ function DoScharrOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*542*/   if (arg["type"]["val"] > 3) {
/*543*/     SendErrorMessage("Выбрано значение за пределом списка.", true);
/*544*/   }
/*545*/   let kernelX = new Array(3);
/*546*/   let kernelY = new Array(3);
/*547*/   for (let i = 0; i < 3; i++) {
/*548*/     kernelX[i] = new Array(3);
/*549*/     kernelY[i] = new Array(3);
/*550*/   }
/*551*/   for (let i = 0; i < 3; i++) {
/*552*/     for (let j = 0; j < 3; j++) {
/*553*/       if (j == 0) {
/*554*/         kernelX[i][j] = 3;
/*555*/         kernelY[j][i] = 3;
/*556*/       }
/*557*/       else if (j == 1) {
/*558*/         kernelX[i][j] = 0;
/*559*/         kernelY[j][i] = 0;
/*560*/       }
/*561*/       else if (j == 2) {
/*562*/         kernelX[i][j] = -3;
/*563*/         kernelY[j][i] = -3;
/*564*/       }
/*565*/     }
/*566*/   }
/*567*/   kernelX[1][0] = 10;
/*568*/   kernelY[0][1] = 10;
/*569*/   kernelX[1][2] = -10;
/*570*/   kernelY[2][1] = -10;
/*571*/   if (arg["type"]["val"] === 0) {
/*572*/     ApplyMatrixFilter(canvas, data, kernelX);
/*573*/   }
/*574*/   else if (arg["type"]["val"] === 1) {
/*575*/     ApplyMatrixFilter(canvas, data, kernelY);
/*576*/   }
/*577*/   else {
/*578*/     let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*579*/     let ctx = canvas.getContext("2d");
/*580*/     let tmpCanvases = new Array(2);
/*581*/     for (let i = 0; i < 2; i++) {
/*582*/       tmpCanvases[i] = document.createElement("canvas");
/*583*/       tmpCanvases[i].width = canvas.width;
/*584*/       tmpCanvases[i].height = canvas.height;
/*585*/       let tmpCtx = tmpCanvases[i].getContext("2d");
/*586*/       tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*587*/     }
/*588*/     ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
/*589*/       ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
/*590*/         let tmpDatas = new Array(2);
/*591*/         for (let i = 0; i < 2; i++) {
/*592*/           let tmpCtx = tmpCanvases[i].getContext("2d");
/*593*/           tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*594*/         }
/*595*/         if (arg["type"]["val"] === 2) {
/*596*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
/*597*/         }
/*598*/         else if (arg["type"]["val"] === 3) {
/*599*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
/*600*/         }
/*601*/         else {
/*602*/           SendErrorMessage("Выбрано значение за пределом списка.", true);
/*603*/         }
/*604*/       });
/*605*/     });
/*606*/   }
/*607*/ }
/*608*/ 
/*609*/ function DoPrewittOperator(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*610*/   if (arg["type"]["val"] > 3) {
/*611*/     SendErrorMessage("Выбрано значение за пределом списка.", true);
/*612*/   }
/*613*/   let kernelX = new Array(3);
/*614*/   let kernelY = new Array(3);
/*615*/   for (let i = 0; i < 3; i++) {
/*616*/     kernelX[i] = new Array(3);
/*617*/     kernelY[i] = new Array(3);
/*618*/   }
/*619*/   for (let i = 0; i < 3; i++) {
/*620*/     for (let j = 0; j < 3; j++) {
/*621*/       if (j == 0) {
/*622*/         kernelX[i][j] = -1;
/*623*/         kernelY[j][i] = -1;
/*624*/       }
/*625*/       else if (j == 1) {
/*626*/         kernelX[i][j] = 0;
/*627*/         kernelY[j][i] = 0;
/*628*/       }
/*629*/       else if (j == 2) {
/*630*/         kernelX[i][j] = 1;
/*631*/         kernelY[j][i] = 1;
/*632*/       }
/*633*/     }
/*634*/   }
/*635*/   if (arg["type"]["val"] === 0) {
/*636*/     ApplyMatrixFilter(canvas, data, kernelX);
/*637*/   }
/*638*/   else if (arg["type"]["val"] === 1) {
/*639*/     ApplyMatrixFilter(canvas, data, kernelY);
/*640*/   }
/*641*/   else {
/*642*/     let [offX, offY, _offW, _offH] = GetOffsetFromElement(canvas);
/*643*/     let ctx = canvas.getContext("2d");
/*644*/     let tmpCanvases = new Array(2);
/*645*/     for (let i = 0; i < 2; i++) {
/*646*/       tmpCanvases[i] = document.createElement("canvas");
/*647*/       tmpCanvases[i].width = canvas.width;
/*648*/       tmpCanvases[i].height = canvas.height;
/*649*/       let tmpCtx = tmpCanvases[i].getContext("2d");
/*650*/       tmpCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
/*651*/     }
/*652*/     ApplyMatrixFilter(tmpCanvases[0], data, kernelX, false, function () {
/*653*/       ApplyMatrixFilter(tmpCanvases[1], data, kernelY, false, function () {
/*654*/         let tmpDatas = new Array(2);
/*655*/         for (let i = 0; i < 2; i++) {
/*656*/           let tmpCtx = tmpCanvases[i].getContext("2d");
/*657*/           tmpDatas[i] = tmpCtx.getImageData(offX, offY, data.width, data.height);
/*658*/         }
/*659*/         if (arg["type"]["val"] === 2) {
/*660*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], ArithmeticMeanColors);
/*661*/         }
/*662*/         else if (arg["type"]["val"] === 3) {
/*663*/           ApplyDataPerPixelOperator(canvas, tmpDatas[0], tmpDatas[1], RootMeanSquareColors);
/*664*/         }
/*665*/         else {
/*666*/           SendErrorMessage("Выбрано значение за пределом списка.", true);
/*667*/         }
/*668*/       });
/*669*/     });
/*670*/   }
/*671*/ }
/*672*/ 
/*673*/ function DoShiftFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*674*/   const shiftX = Number(arg["x"]["val"]);
/*675*/   if (shiftX == NaN)
/*676*/     SendErrorMessage("Введено неверное значение x", true);
/*677*/   const shiftY = Number(arg["y"]["val"]);
/*678*/   if (shiftY == NaN)
/*679*/     SendErrorMessage("Введено неверное значение y", true);
/*680*/   ApplyGeometryFilter(canvas, data, function (k, l) {
/*681*/     let x = k + shiftX;
/*682*/     let y = l + shiftY;
/*683*/     return [x, y];
/*684*/   });
/*685*/ }
/*686*/ 
/*687*/ function DoRotateFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*688*/   const x0 = Number(arg["x0"]["val"]);
/*689*/   if (x0 == NaN)
/*690*/     SendErrorMessage("Введено неверное значение x0", true);
/*691*/   const y0 = Number(arg["y0"]["val"]);
/*692*/   if (x0 == NaN)
/*693*/     SendErrorMessage("Введено неверное значение y0", true);
/*694*/   const angle = Number.parseFloat(arg["angle"]["val"]) * Math.PI / 180.0;
/*695*/   if (angle == NaN)
/*696*/     SendErrorMessage("Введено неверное значение угла", true);
/*697*/   ApplyGeometryFilter(canvas, data, function (k, l) {
/*698*/     let x = Math.round((k - x0) * Math.cos(angle) - (l - y0) * Math.sin(angle) + x0);
/*699*/     let y = Math.round((k - x0) * Math.sin(angle) + (l - y0) * Math.cos(angle) + y0);
/*700*/     return [x, y]
/*701*/   });
/*702*/ }
/*703*/ 
/*704*/ function DoWave1Filter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*705*/   ApplyGeometryFilter(canvas, data, function (k, l) {
/*706*/     let x = Math.round(k + 20.0 * Math.sin(2 * Math.PI * l / 60.0));
/*707*/     let y = l;
/*708*/     return [x, y];
/*709*/   }, false);
/*710*/ }
/*711*/ 
/*712*/ function DoWave2Filter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*713*/   ApplyGeometryFilter(canvas, data, function (k, l) {
/*714*/     let x = Math.round(k + 20.0 * Math.sin(2 * Math.PI * k / 30.0));
/*715*/     let y = l;
/*716*/     return [x, y];
/*717*/   }, false);
/*718*/ }
/*719*/ 
/*720*/ function DoGlassEffectFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*721*/   ApplyGeometryFilter(canvas, data, function (k, l) {
/*722*/     let x = Math.round(k + (Math.random() - 0.5) * 10.0);
/*723*/     let y = Math.round(l + (Math.random() - 0.5) * 10.0);
/*724*/     return [x, y];
/*725*/   }, false)
/*726*/ }
/*727*/ 
/*728*/ function DoDialation(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*729*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*730*/   ApplyDialation(canvas, data, mask);
/*731*/ }
/*732*/ 
/*733*/ function DoErosion(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*734*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*735*/   ApplyErosion(canvas, data, mask);
/*736*/ }
/*737*/ 
/*738*/ function DoOpening(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*739*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*740*/   ApplyOpening(canvas, data, mask);
/*741*/ }
/*742*/ 
/*743*/ function DoClosing(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*744*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*745*/   ApplyClosing(canvas, data, mask);
/*746*/ }
/*747*/ 
/*748*/ function DoGrad(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*749*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*750*/   ApplyGrad(canvas, data, mask);
/*751*/ }
/*752*/ 
/*753*/ function DoTopHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*754*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*755*/   ApplyTopHat(canvas, data, mask);
/*756*/ }
/*757*/ 
/*758*/ function DoBlackHat(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*759*/   let mask = GetMatrixFromTextarea(arg["matrix"]["val"]);
/*760*/   ApplyBlackHat(canvas, data, mask);
/*761*/ }
/*762*/ 
/*763*/ function DoMedianFilter(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*764*/   let radius = Number(arg["r"]["val"]);
/*765*/   if (radius <= 0) {
/*766*/     SendErrorMessage("Радиус должен быть > 0.", true);
/*767*/   }
/*768*/   ApplyMedianFilter(canvas, data, radius);
/*769*/ }
/*770*/ 
/*771*/ function DoLinearCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {})
/*772*/ {
/*773*/   let histograms = [GetHistogram(data, "r"), GetHistogram(data, "g"), GetHistogram(data, "b")]
/*774*/   let min = new Array(3);
/*775*/   let max = new Array(3);
/*776*/   for (let i = 0; i < 3; i++) {
/*777*/     min[i] = NumArrayFindMinIndex(histograms[i]);
/*778*/     max[i] = NumArrayFindMaxIndex(histograms[i]);
/*779*/   }
/*780*/   ApplyPerPixelFilter(canvas, data, function(r, g, b, a) {
/*781*/     let arr = [r, g, b, a];
/*782*/     for (let i = 0; i < 3; i++) {
/*783*/       arr[i] = (arr[i] - min[i])*255.0/(max[i] - min[i]);
/*784*/     }
/*785*/     return arr;
/*786*/   });
/*787*/ }
/*788*/ 
/*789*/ //function DoLinearCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*790*/ //  let histogram = GetHistogram(data, "hsl");
/*791*/ //  let min = NumArrayFindMinIndex(histogram);
/*792*/ //  let max = NumArrayFindMaxIndex(histogram);
/*793*/ //  ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*794*/ //    let arr = [r, g, b, a];
/*795*/ //    for (let i = 0; i < 3; i++) {
/*796*/ //      arr[i] = (arr[i] - min) * 255.0 / (max - min);
/*797*/ //    }
/*798*/ //    return arr;
/*799*/ //  });
/*800*/ //}
/*801*/ 
/*802*/ function DoGammaCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*803*/   let c = parseFloat(arg["c"]["val"]);
/*804*/   if (c <= 0.0 + Number.EPSILON) {
/*805*/     SendErrorMessage("Константа должна быть > 0.", true);
/*806*/   }
/*807*/   let gam = parseFloat(arg["gam"]["val"]);
/*808*/   if (gam <= 0.0 + Number.EPSILON) {
/*809*/     SendErrorMessage("Гамма должна быть > 0.", true);
/*810*/   }
/*811*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*812*/     let arr = [r, g, b, a];
/*813*/     for (let i = 0; i < 3; i++) {
/*814*/       arr[i] = arr[i] / 255.0;
/*815*/       arr[i] = c * Math.pow(arr[i], gam);
/*816*/       arr[i] = arr[i] * 255.0;
/*817*/     }
/*818*/     return arr;
/*819*/   });
/*820*/ }
/*821*/ 
/*822*/ function DoLogCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*823*/   let c = parseFloat(arg["c"]["val"]);
/*824*/   if (c <= 0.0 + Number.EPSILON) {
/*825*/     SendErrorMessage("Константа должна быть > 0.", true);
/*826*/   }
/*827*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*828*/     let arr = [r, g, b, a];
/*829*/     for (let i = 0; i < 3; i++) {
/*830*/       arr[i] = c * Math.log(arr[i] + 1.0);
/*831*/     }
/*832*/     return arr;
/*833*/   });
/*834*/ }
/*835*/ 
/*836*/ function DoGreyWorld(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*837*/   let colorsAvg = [0, 0, 0];
/*838*/   let n = Math.floor(data.data.length / 4 + Number.EPSILON);
/*839*/   for (let i = 0; i < data.data.length; i += 4) {
/*840*/     for (let j = 0; j < 3; j++) {
/*841*/       colorsAvg[j] += data.data[i + j] / n;
/*842*/     }
/*843*/   }
/*844*/   let avg = 0;
/*845*/   for (let j = 0; j < 3; j++) {
/*846*/     avg += colorsAvg[j];
/*847*/   }
/*848*/   avg /= 3.0;
/*849*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*850*/     return [r * avg / colorsAvg[0], g * avg / colorsAvg[1], b * avg / colorsAvg[2], a];
/*851*/   });
/*852*/ }
/*853*/ 
/*854*/ function DoPerfectReflector(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg = {}) {
/*855*/   let colorsMax = [0, 0, 0];
/*856*/   for (let i = 0; i < data.data.length; i += 4) {
/*857*/     for (let j = 0; j < 3; j++) {
/*858*/       if (data.data[i + j] > colorsMax[j]) {
/*859*/         colorsMax[j] = data.data[i + j];
/*860*/       }
/*861*/     }
/*862*/   }
/*863*/   let cs = new Array(3);
/*864*/   for (let j = 0; j < 3; j++) {
/*865*/     cs[j] = 255.0 / colorsMax[j];
/*866*/   }
/*867*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*868*/     return [r * cs[0], g * cs[1], b * cs[2], a];
/*869*/   });
/*870*/ }
/*871*/ 
/*872*/ function DoColorMappingCorrection(/*Canvas*/ canvas, /*ImageData*/ data, /*Dict*/ arg) {
/*873*/   let colors = {};
/*874*/   Object.keys(arg).forEach(function (key) {
/*875*/     if (arg[key]["val"] != null) {
/*876*/       colors[key] = Number(arg[key]["val"]);
/*877*/       if (colors[key] < 0 || colors[key] > 255) {
/*878*/         let tmp;
/*879*/         if (key[1] == "1") {
/*880*/           tmp = "исходного";
/*881*/         }
/*882*/         else {
/*883*/           tmp = "правильного";
/*884*/         }
/*885*/         SendErrorMessage("Неверное значение канала " + key[0].toUpperCase() + " " + tmp + " цвета.", true);
/*886*/       }
/*887*/     }
/*888*/   });
/*889*/   ApplyPerPixelFilter(canvas, data, function (r, g, b, a) {
/*890*/     return [r * colors["r2"] / colors["r1"], g * colors["g2"] / colors["g1"], b * colors["b2"] / colors["b1"], a];
/*891*/   });
/*892*/ }


// --------------------------------------------------------------------------------------------------------------------------------
// Compiled index.js
// --------------------------------------------------------------------------------------------------------------------------------

/*1*/ 
/*2*/ 
/*3*/ 
/*4*/ 
/*5*/ let errorElement = document.getElementById("error-message");
/*6*/ 
/*7*/ window.addEventListener("load", (event) => {
/*8*/   let symbols = document.getElementsByClassName("symbol-uni-text");
/*9*/   for (let i = 0; i < symbols.length; i++) {
/*10*/     symbols[i].style.fontSize = "1.25em";
/*11*/   }
/*12*/   document.getElementById("image-input").disabled = false;
/*13*/   FiltersInit();
/*14*/   HideHistogramCanvas();
/*15*/ });
/*16*/ 
/*17*/ function ResetOffset() {
/*18*/   let canvas = document.getElementById("edited-img-canvas");
/*19*/   document.getElementById("offset-input-x").value = "0";
/*20*/   document.getElementById("offset-input-y").value = "0";
/*21*/   document.getElementById("offset-input-w").value = canvas.width.toString();
/*22*/   document.getElementById("offset-input-h").value = canvas.height.toString();
/*23*/ }
/*24*/ 
/*25*/ function ShowWhenImgUpload() {
/*26*/   document.getElementById("select-filter").style.display = "inline-block";
/*27*/   document.getElementById("images-table").style.display = "inline-block";
/*28*/   document.getElementById("save-table").style.display = "inline-block";
/*29*/   document.getElementById("offset-table").style.display = "inline-block";
/*30*/   document.getElementById("history-table").style.display = "inline-block";
/*31*/   document.getElementById("histogram-button").style.display = "inline-block";
/*32*/ }
/*33*/ 
/*34*/ function OnSaveButtonClick() {
/*35*/   // Save image.
/*36*/   //document.getElementById("save-button").href=document.getElementById("edited-img-canvas").toDataURL("image/png"); // Doesn't work.
/*37*/   let link = document.createElement('a');
/*38*/   link.download = "image.png";
/*39*/   link.href = document.getElementById("edited-img-canvas").toDataURL();
/*40*/   link.click();
/*41*/   link.remove();
/*42*/   link = null;
/*43*/ }
/*44*/ 
/*45*/ function OnResetButtonClick() {
/*46*/   document.getElementById("reset-button").disabled = true;
/*47*/   document.getElementById("history-prev-button").disabled = false;
/*48*/   document.getElementById("history-next-button").disabled = true;
/*49*/   //history.DeleteAfterCurrent();
/*50*/   let canvas = document.getElementById("edited-img-canvas");
/*51*/   let ctx = canvas.getContext("2d");
/*52*/   ctx.drawImage(document.getElementById("original-img-canvas"), 0, 0);
/*53*/   DirtHistogram();
/*54*/   //HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
/*55*/ }
/*56*/ 
/*57*/ function OnHistoryPrevButtonClick() {
/*58*/   if (!document.getElementById("reset-button").disabled) {
/*59*/     history.Prev();
/*60*/   }
/*61*/   else {
/*62*/     document.getElementById("reset-button").disabled = false;
/*63*/   }
/*64*/   HistoryUpdate();
/*65*/ }
/*66*/ 
/*67*/ function OnHistoryNextButtonClick() {
/*68*/   history.Next();
/*69*/   HistoryUpdate();
/*70*/ }
/*71*/ 
/*72*/ function OnHistoryResetButtonClick() {
/*73*/   history.DeleteAll();
/*74*/   document.getElementById("history-prev-button").disabled = true;
/*75*/   document.getElementById("history-next-button").disabled = true;
/*76*/   let canvas = document.getElementById("edited-img-canvas");
/*77*/   let ctx = canvas.getContext("2d");
/*78*/   HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
/*79*/   HistoryLog();
/*80*/ }
/*81*/ 
/*82*/ function HistoryReset() {
/*83*/   history.DeleteAll();
/*84*/   document.getElementById("history-prev-button").disabled = true;
/*85*/   document.getElementById("history-next-button").disabled = true;
/*86*/ }
/*87*/ 
/*88*/ function OnSelectFilter() {
/*89*/   let filterOptionsTable = document.getElementById("filter-options-table");
/*90*/   let selectFilter = document.getElementById("select-filter");
/*91*/   if (selectFilter.selectedIndex === 0)
/*92*/     return;
/*93*/   let filterOption = selectFilter.options[selectFilter.selectedIndex].value;
/*94*/   while (filterOptionsTable.firstChild) {
/*95*/     filterOptionsTable.firstChild.remove();
/*96*/   }
/*97*/   //filtersDict[filterOption]["argsHTML"] = {};
/*98*/   Object.keys(filtersDict[filterOption]["args"]).forEach(function (key) {
/*99*/     let container = filterOptionsTable.appendChild(document.createElement("tr"));
/*100*/     let label_e = container.appendChild(document.createElement("td"));
/*101*/     if (filtersDict[filterOption]["args"][key] == null) {
/*102*/       label_e.innerHTML = key;
/*103*/       container.appendChild(document.createElement("td"));
/*104*/       return;
/*105*/     }
/*106*/     label_e.innerHTML = filtersDict[filterOption]["args"][key]["label"];
/*107*/     let e = container.appendChild(document.createElement("td")).appendChild(document.createElement(filtersDict[filterOption]["args"][key]["type"].split(" ")[0]));
/*108*/     filtersDict[filterOption]["args"][key]["html"] = e;
/*109*/     e.classList.add("filter-option-created");
/*110*/ 
/*111*/     if (e.tagName.toLowerCase() == "select") {
/*112*/       for (let i = 0; i < filtersDict[filterOption]["args"][key]["values"].length; i++) {
/*113*/         let opt = e.appendChild(document.createElement("option"));
/*114*/         opt.value = filtersDict[filterOption]["args"][key]["values"][i];
/*115*/         opt.innerHTML = filtersDict[filterOption]["args"][key]["values"][i];
/*116*/       }
/*117*/       e.selectedIndex = 0;
/*118*/     }
/*119*/     else if (e.tagName.toLowerCase() == "input") {
/*120*/       e.type = filtersDict[filterOption]["args"][key]["input-type"];
/*121*/       e.value = filtersDict[filterOption]["args"][key]["value"];
/*122*/     }
/*123*/     else if (e.tagName.toLowerCase() == "textarea") {
/*124*/       e.placeholder = filtersDict[filterOption]["args"][key]["placeholder"];
/*125*/       e.value = filtersDict[filterOption]["args"][key]["value"];
/*126*/     }
/*127*/     else if (e.tagName.toLowerCase() == "checkbox") {
/*128*/       e.type = filtersDict[filterOption]["args"][key]["input-type"];
/*129*/       e.checked = filtersDict[filterOption]["args"][key]["checked"];
/*130*/     }
/*131*/   });
/*132*/   document.getElementById("apply-filter-button").style.display = "inline-block";
/*133*/ }
/*134*/ 
/*135*/ function OnApplyFilterButtonClick() {
/*136*/   let selectFilter = document.getElementById("select-filter");
/*137*/   let filterOption = selectFilter.options[selectFilter.selectedIndex].value;
/*138*/   if (filtersDict[filterOption] === null) {
/*139*/     SendErrorMessage("Как вы выбрали это? У вас не должна была быть возможность сделать это.", true);
/*140*/   }
/*141*/   let argsForLog = "";
/*142*/   Object.keys(filtersDict[filterOption]["args"]).forEach(function (key) {
/*143*/     if (filtersDict[filterOption]["args"][key] == null)
/*144*/       return;
/*145*/     let e = filtersDict[filterOption]["args"][key]["html"];
/*146*/     if (e.tagName.toLowerCase() == "select") {
/*147*/       //if (filtersDict[filterOption]["args"][key]["input-type"]) {
/*148*/       //  filtersDict[filterOption]["args"][key]["val"] = e.options[e.selectedIndex].checked;
/*149*/       //}
/*150*/       //else {
/*151*/       //filtersDict[filterOption]["args"][key]["val"] = e.options[e.selectedIndex].value;
/*152*/       //}
/*153*/       filtersDict[filterOption]["args"][key]["val"] = e.selectedIndex;
/*154*/     }
/*155*/     else if (e.tagName.toLowerCase() == "input" || e.tagName.toLowerCase() == "textarea") {
/*156*/       filtersDict[filterOption]["args"][key]["val"] = e.value;
/*157*/     }
/*158*/     else if (e.tagName.toLowerCase() == "checkbox") {
/*159*/       filtersDict[filterOption]["args"][key]["val"] = e.checked;
/*160*/     }
/*161*/     let tmpForLog = filtersDict[filterOption]["args"][key]["val"];
/*162*/     if (typeof tmpForLog !== 'string') {
/*163*/       tmpForLog = tmpForLog.toString();
/*164*/     }
/*165*/     argsForLog += key + '=' + tmpForLog + '\n';
/*166*/   });
/*167*/   if (argsForLog === "") {
/*168*/     argsForLog = "null";
/*169*/   }
/*170*/   let canvas = document.getElementById("edited-img-canvas");
/*171*/   let ctx = canvas.getContext("2d");
/*172*/   let [x, y, w, h] = GetOffsetFromElement(canvas);
/*173*/   if (document.getElementById("reset-button").disabled && history.count > 1) {
/*174*/     HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
/*175*/   }
/*176*/   console.info("Применяем фильтр " + filterOption + " с оффсетами x=" + x.toString() + " y=" + y.toString() + " w=" + w.toString() + " h=" + h.toString() + " с аргументами:\n" + argsForLog);
/*177*/   filtersDict[filterOption]["func"](canvas, ctx.getImageData(x, y, w, h), filtersDict[filterOption]["args"]);
/*178*/ }
/*179*/ 
/*180*/ document.getElementById("image-input").addEventListener("change", function (e) {
/*181*/   // https://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
/*182*/   if (!e.target.files) {
/*183*/     SendErrorMessage("Файл не найден.", true);
/*184*/   }
/*185*/   let reader = new FileReader();
/*186*/   reader.readAsDataURL(e.target.files[0]);
/*187*/   reader.onloadend = function (e) {
/*188*/     let img = new Image();
/*189*/     img.src = e.target.result;
/*190*/     img.onload = () => {
/*191*/       let canvases = [document.getElementById("original-img-canvas"), document.getElementById("edited-img-canvas")];
/*192*/       for (let i = 0; i < 2; i++) {
/*193*/         let ctx = canvases[i].getContext("2d");
/*194*/         canvases[i].width = img.width;
/*195*/         canvases[i].height = img.height;
/*196*/         ctx.drawImage(img, 0, 0);
/*197*/       }
/*198*/       OnHistoryResetButtonClick();
/*199*/       document.getElementById("reset-button").disabled = true;
/*200*/ 
/*201*/       ResetOffset();
/*202*/       ShowWhenImgUpload();
/*203*/       OnSelectFilter();
/*204*/       DrawOriginalHistogramCanvas();
/*205*/     }
/*206*/   }
/*207*/ });
/*208*/ 
/*209*/ document.getElementById("histogram-button").onclick = () => {
/*210*/   // https://javascript.info/popup-windows
/*211*/   // or don't use popups??
/*212*/   //let popup = window.open("about:blank", "Гистограмма", "width=1000,height=500");
/*213*/   let canvas = document.getElementById("histograms-table");
/*214*/   if (canvas.style.display == "none") {
/*215*/     ShowHistogramCanvas();
/*216*/   }
/*217*/   else {
/*218*/     HideHistogramCanvas();
/*219*/   }
/*220*/ };
/*221*/ 
/*222*/ document.getElementById("logo").onclick = () => {
/*223*/   document.getElementById("logo").style.display = "none";
/*224*/ }
