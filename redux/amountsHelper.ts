import { AmountInput, AmountOutputs } from "../types/amount";
import { IRate } from "../types/rates";

// customAmount введена в калькуляторе в одно из полей отдаю/получаю
// ограничить поле ввода до 8 знаков

const symbols = {
  usd: "$",
  rub: "₽",
  uah: "₴",
  eur: "Є",
  gbp: "£",
  gel: "₾",
  try: "₺",
  thb: "฿",
  inr: "₹",
  jpy: "¥",
  cny: "¥",
};

export const codeToSymbol = (code: string) =>
  symbols[code.toLowerCase() as keyof typeof symbols] || "";

export class FeesCalculator {
  rate: IRate;
  amountInput: AmountInput;
  giveCode: string;
  getCode: string;

  constructor(dir: string, rate: IRate, amountInput: AmountInput) {
    this.giveCode = dir.split("_")[0];
    this.getCode = dir.split("_")[1];
    this.rate = rate;
    this.amountInput = amountInput;
  }

  calculateAmountOutputs = (): AmountOutputs => {
    const { side, str } = this.amountInput;
    const oppositeSide = side === "get" ? "give" : "get";
    let outputs = {} as AmountOutputs;
    const calculatedAmount = this._calculateFee();

    outputs[oppositeSide] = // то, что посчитано
      calculatedAmount > 0
        ? formatNumberInput(String(roundAmount(calculatedAmount)))
        : "";

    const input = Number.isNaN(+str) // то, что введено
      ? "" // гасим вставки букв из буфера
      : str.endsWith(".") || str.endsWith("0") || str === ""
      ? str // не округляем незаконченные строки
      : String(roundAmount(+str));

    outputs[side] = formatNumberInput(input) || "";

    return outputs;
  };

  _calculateFee = (): number => {
    const { side, num } = this.amountInput;
    let to_fee,
      from_fee,
      course = undefined;
    try {
      ({ to_fee, from_fee, course } = this.rate);
    } catch (e) {}
    if (!course || !num) return 0;
    if (side === "give") {
      if (!from_fee && !to_fee) return num / course;
      // вычитаем fromfee из in
      const inMinusFromFee = this._removeFromFee(num);
      // вычитаем  tofee из out
      return this._removeToFee(inMinusFromFee / course);
    }
    if (side === "get") {
      if (!from_fee && !to_fee) return num * course;
      // прибавляем tofee к out
      const outPlusToFee = this._addToFee(num);
      // прибавляем fromfee к in
      return this._addFromFee(outPlusToFee * course);
    }
    return 0;
  };

  _addFromFee = (customIn: number) => {
    const { from_fee, course } = this.rate;
    if (!from_fee) return customIn; // если fee null, оставляем как есть
    const [feeStr, symbol] = from_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customIn / (1 - fee / 100);
    if (this.giveCode.includes(symbol)) return customIn + fee; //совпала валюта
    if (this.getCode.includes(symbol)) return customIn + fee * course;
    return customIn; //не указана ни валюта ни %, возвращаем исходную сумму
  };

  _addToFee = (customOut: number) => {
    const { to_fee, course } = this.rate;
    if (!to_fee) return customOut; // если fee null, оставляем как есть
    const [feeStr, symbol] = to_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customOut / (1 - fee / 100);
    if (this.getCode.includes(symbol)) return customOut + fee; //совпала валюта
    if (this.giveCode.includes(symbol)) return customOut + fee / course;
    return customOut; //не указана ни валюта ни %, возвращаем исходную сумму
  };

  _removeFromFee = (customIn: number) => {
    const { from_fee, course } = this.rate;
    if (!from_fee) return customIn; // если fee null, оставляем как есть
    const [feeStr, symbol] = from_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customIn * (1 - fee / 100);
    if (this.giveCode.includes(symbol))
      return fee > customIn ? 0 : customIn - fee; //совпала валюта
    if (this.getCode.includes(symbol))
      return fee * course > customIn ? 0 : customIn - fee * course;
    return customIn; //не указана ни валюта ни %, возвращаем исходную сумму
  };

  _removeToFee = (customOut: number) => {
    const { to_fee, course } = this.rate;
    if (!to_fee) return customOut; // если fee null, оставляем как есть
    const [feeStr, symbol] = to_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customOut * (1 - fee / 100);
    if (this.getCode.includes(symbol))
      return fee > customOut ? 0 : customOut - fee; //совпала валюта
    if (this.giveCode.includes(symbol))
      return fee / course > customOut ? 0 : customOut - fee / course;
    return customOut; //не указана ни валюта ни %, возвращаем исходную сумму
  };
}

export const kFormatter = (num: number) => {
  return Math.abs(num) > 999999999
    ? "-"
    : Math.abs(num) > 999999
    ? Math.sign(num) * +(Math.abs(num) / 1000000).toFixed(1) + "m"
    : Math.abs(num) > 999
    ? Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};

export const roundAmount = (amount: number, rude = false): number => {
  // в логарифм нули не вставляем
  const factor = rude ? 1 : 3;

  // if (amount > 99)
  //   return (
  //     +(amount / 10 ** String(amount).length).toFixed(1) *
  //     10 ** String(amount).length
  //   );
  if (!amount || typeof amount !== "number") return 0;
  if (amount > 100 && rude)
    return +(
      +(amount / 10 ** amount.toFixed(0).length).toFixed(2) *
      10 ** amount.toFixed(0).length
    ).toFixed(0);
  // нахожу минимальный значимый порядок числа
  // это такое число, в которое нужно возвести десятку, чтобы получить тысячную долю amount
  const orderOfMagnitude = -Math.floor(Math.log10(amount / 10 ** factor));
  //  округляем только часть после точки до порядка равного orderOfMagnitude
  return +amount.toFixed(orderOfMagnitude < 0 ? 0 : orderOfMagnitude);
};

export const formatNumberInput = (x: string | number) => {
  if (!x) return x;
  const s = String(x);
  let parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

export const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) / a < 0.1;

export const beautifyAmount = (number: number, currency: string) =>
  formatNumberInput(roundAmount(number) + " " + currency);
