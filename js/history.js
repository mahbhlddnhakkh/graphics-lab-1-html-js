import { DirtHistogram } from "./util";

const historySize = 10;

class History {
  constructor(/*Number*/ size) {
    this.size = size;
    this.i = -1;
    this.count = 0;
    this.data = [];
    this.data.length = this.size;
  }

  IsFull() {
    return this.count == this.size;
  }

  NextExist() {
    return this.i + 1 < this.count;
  }

  PrevExist() {
    return this.i - 1 >= 0;
  }

  Next() {
    this.i++;
  }

  Prev() {
    this.i--;
  }

  GetCurrent() {
    return this.data[this.i];
  }

  Add(/*ImageData*/ data) {
    this.DeleteAfterCurrent();
    if (this.IsFull()) {
      this.data.shift();
      this.count--;
    }
    else {
      this.i++;
    }
    this.data.push(data);
    this.count++;
  }

  DeleteAfterCurrent() {
    this.data.length = this.i + 1;
    this.count = this.i + 1;
  }

  DeleteAll() {
    this.data.length = 0;
    this.count = 0;
    this.i = -1;
  }
}

export let history = new History(historySize);

export function HistoryUpdate() {
  document.getElementById("history-next-button").disabled = !history.NextExist();
  document.getElementById("history-prev-button").disabled = !history.PrevExist();
  let canvas = document.getElementById("edited-img-canvas");
  let ctx = canvas.getContext("2d");
  ctx.putImageData(history.GetCurrent(), 0, 0);
  HistoryLog();
  DirtHistogram();
}

export function HistoryAdd(/*ImageData*/ data) {
  history.Add(CopyImageData(data));
  //history.DeleteAfterCurrent();
  document.getElementById("history-next-button").disabled = !history.NextExist();
  document.getElementById("history-prev-button").disabled = !history.PrevExist();
}

export function HistoryLog() {
  console.info("History " + (history.i + 1).toString() + '/' + history.count.toString() + '/' + history.size.toString() + " (индекс/количество/размер).");
}
