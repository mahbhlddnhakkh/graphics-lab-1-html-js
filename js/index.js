import { SendErrorMessage, GetOffsetFromElement, HideHistogramCanvas, ShowHistogramCanvas, DirtHistogram, DrawOriginalHistogramCanvas } from "./util.js";
import { filtersDict, FiltersInit } from "./filters.js";
import { history, HistoryUpdate, HistoryAdd, HistoryLog } from "./history.js";

let errorElement;

window.addEventListener("load", (event) => {
	errorElement = document.getElementById("error-message");
	document.getElementById("image-input").addEventListener("change", function (e) {
		// https://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
		if (!e.target.files) {
		  SendErrorMessage("Файл не найден.", true);
		}
		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onloadend = function (e) {
		  let img = new Image();
		  img.src = e.target.result;
		  img.onload = () => {
		    let canvases = [document.getElementById("original-img-canvas"), document.getElementById("edited-img-canvas")];
		    for (let i = 0; i < 2; i++) {
		      let ctx = canvases[i].getContext("2d");
		      canvases[i].width = img.width;
		      canvases[i].height = img.height;
		      ctx.drawImage(img, 0, 0);
		    }
		    OnHistoryResetButtonClick();
		    document.getElementById("reset-button").disabled = true;

		    ResetOffset();
		    ShowWhenImgUpload();
		    OnSelectFilter();
		    DrawOriginalHistogramCanvas();
		  }
		}
	});

	document.getElementById("histogram-button").onclick = () => {
		// https://javascript.info/popup-windows
		// or don't use popups??
		//let popup = window.open("about:blank", "Гистограмма", "width=1000,height=500");
		let canvas = document.getElementById("histograms-table");
		if (canvas.style.display == "none") {
		  ShowHistogramCanvas();
		}
		else {
		  HideHistogramCanvas();
		}
	};

	document.getElementById("logo").onclick = () => {
		document.getElementById("logo").style.display = "none";
	}
		let symbols = document.getElementsByClassName("symbol-uni-text");
		for (let i = 0; i < symbols.length; i++) {
		  symbols[i].style.fontSize = "1.25em";
		}
		document.getElementById("image-input").disabled = false;
		FiltersInit();
		HideHistogramCanvas();
});

function ResetOffset() {
  let canvas = document.getElementById("edited-img-canvas");
  document.getElementById("offset-input-x").value = "0";
  document.getElementById("offset-input-y").value = "0";
  document.getElementById("offset-input-w").value = canvas.width.toString();
  document.getElementById("offset-input-h").value = canvas.height.toString();
}

function ShowWhenImgUpload() {
  document.getElementById("select-filter").style.display = "inline-block";
  document.getElementById("images-table").style.display = "inline-block";
  document.getElementById("save-table").style.display = "inline-block";
  document.getElementById("offset-table").style.display = "inline-block";
  document.getElementById("history-table").style.display = "inline-block";
  document.getElementById("histogram-button").style.display = "inline-block";
}

function OnSaveButtonClick() {
  // Save image.
  //document.getElementById("save-button").href=document.getElementById("edited-img-canvas").toDataURL("image/png"); // Doesn't work.
  let link = document.createElement('a');
  link.download = "image.png";
  link.href = document.getElementById("edited-img-canvas").toDataURL();
  link.click();
  link.remove();
  link = null;
}

function OnResetButtonClick() {
  document.getElementById("reset-button").disabled = true;
  document.getElementById("history-prev-button").disabled = false;
  document.getElementById("history-next-button").disabled = true;
  //history.DeleteAfterCurrent();
  let canvas = document.getElementById("edited-img-canvas");
  let ctx = canvas.getContext("2d");
  ctx.drawImage(document.getElementById("original-img-canvas"), 0, 0);
  DirtHistogram();
  //HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function OnHistoryPrevButtonClick() {
  if (!document.getElementById("reset-button").disabled) {
    history.Prev();
  }
  else {
    document.getElementById("reset-button").disabled = false;
  }
  HistoryUpdate();
}

function OnHistoryNextButtonClick() {
  history.Next();
  HistoryUpdate();
}

function OnHistoryResetButtonClick() {
  history.DeleteAll();
  document.getElementById("history-prev-button").disabled = true;
  document.getElementById("history-next-button").disabled = true;
  let canvas = document.getElementById("edited-img-canvas");
  let ctx = canvas.getContext("2d");
  HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
  HistoryLog();
}

function HistoryReset() {
  history.DeleteAll();
  document.getElementById("history-prev-button").disabled = true;
  document.getElementById("history-next-button").disabled = true;
}

function OnSelectFilter() {
  let filterOptionsTable = document.getElementById("filter-options-table");
  let selectFilter = document.getElementById("select-filter");
  if (selectFilter.selectedIndex === 0)
    return;
  let filterOption = selectFilter.options[selectFilter.selectedIndex].value;
  while (filterOptionsTable.firstChild) {
    filterOptionsTable.firstChild.remove();
  }
  //filtersDict[filterOption]["argsHTML"] = {};
  Object.keys(filtersDict[filterOption]["args"]).forEach(function (key) {
    let container = filterOptionsTable.appendChild(document.createElement("tr"));
    let label_e = container.appendChild(document.createElement("td"));
    if (filtersDict[filterOption]["args"][key] == null) {
      label_e.innerHTML = key;
      container.appendChild(document.createElement("td"));
      return;
    }
    label_e.innerHTML = filtersDict[filterOption]["args"][key]["label"];
    let e = container.appendChild(document.createElement("td")).appendChild(document.createElement(filtersDict[filterOption]["args"][key]["type"].split(" ")[0]));
    filtersDict[filterOption]["args"][key]["html"] = e;
    e.classList.add("filter-option-created");

    if (e.tagName.toLowerCase() == "select") {
      for (let i = 0; i < filtersDict[filterOption]["args"][key]["values"].length; i++) {
        let opt = e.appendChild(document.createElement("option"));
        opt.value = filtersDict[filterOption]["args"][key]["values"][i];
        opt.innerHTML = filtersDict[filterOption]["args"][key]["values"][i];
      }
      e.selectedIndex = 0;
    }
    else if (e.tagName.toLowerCase() == "input") {
      e.type = filtersDict[filterOption]["args"][key]["input-type"];
      e.value = filtersDict[filterOption]["args"][key]["value"];
    }
    else if (e.tagName.toLowerCase() == "textarea") {
      e.placeholder = filtersDict[filterOption]["args"][key]["placeholder"];
      e.value = filtersDict[filterOption]["args"][key]["value"];
    }
    else if (e.tagName.toLowerCase() == "checkbox") {
      e.type = filtersDict[filterOption]["args"][key]["input-type"];
      e.checked = filtersDict[filterOption]["args"][key]["checked"];
    }
  });
  document.getElementById("apply-filter-button").style.display = "inline-block";
}

function OnApplyFilterButtonClick() {
  let selectFilter = document.getElementById("select-filter");
  let filterOption = selectFilter.options[selectFilter.selectedIndex].value;
  if (filtersDict[filterOption] === null) {
    SendErrorMessage("Как вы выбрали это? У вас не должна была быть возможность сделать это.", true);
  }
  let argsForLog = "";
  Object.keys(filtersDict[filterOption]["args"]).forEach(function (key) {
    if (filtersDict[filterOption]["args"][key] == null)
      return;
    let e = filtersDict[filterOption]["args"][key]["html"];
    if (e.tagName.toLowerCase() == "select") {
      //if (filtersDict[filterOption]["args"][key]["input-type"]) {
      //  filtersDict[filterOption]["args"][key]["val"] = e.options[e.selectedIndex].checked;
      //}
      //else {
      //filtersDict[filterOption]["args"][key]["val"] = e.options[e.selectedIndex].value;
      //}
      filtersDict[filterOption]["args"][key]["val"] = e.selectedIndex;
    }
    else if (e.tagName.toLowerCase() == "input" || e.tagName.toLowerCase() == "textarea") {
      filtersDict[filterOption]["args"][key]["val"] = e.value;
    }
    else if (e.tagName.toLowerCase() == "checkbox") {
      filtersDict[filterOption]["args"][key]["val"] = e.checked;
    }
    let tmpForLog = filtersDict[filterOption]["args"][key]["val"];
    if (typeof tmpForLog !== 'string') {
      tmpForLog = tmpForLog.toString();
    }
    argsForLog += key + '=' + tmpForLog + '\n';
  });
  if (argsForLog === "") {
    argsForLog = "null";
  }
  let canvas = document.getElementById("edited-img-canvas");
  let ctx = canvas.getContext("2d");
  let [x, y, w, h] = GetOffsetFromElement(canvas);
  if (document.getElementById("reset-button").disabled && history.count > 1) {
    HistoryAdd(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }
  console.info("Применяем фильтр " + filterOption + " с оффсетами x=" + x.toString() + " y=" + y.toString() + " w=" + w.toString() + " h=" + h.toString() + " с аргументами:\n" + argsForLog);
  filtersDict[filterOption]["func"](canvas, ctx.getImageData(x, y, w, h), filtersDict[filterOption]["args"]);
}

