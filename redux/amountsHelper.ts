import { AmountInput, AmountOutputs } from "../types/amount";
import { IRate } from "../types/rates";

// customAmount введена в калькуляторе в одно из полей отдаю/получаю
// ограничить поле ввода до 8 знаков

export const symbols = {
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
  btc: "₿",
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
      calculatedAmount > 0 ? addSpaces(String(R(calculatedAmount))) : "";

    const input = Number.isNaN(+str) // то, что введено
      ? "" // гасим вставки букв из буфера
      : str.endsWith(".") || str.endsWith("0") || str === ""
      ? str // не округляем незаконченные строки
      : String(R(+str));

    outputs[side] = addSpaces(input) || "";

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
  if (num < 100 && !(num % 1)) return num + ".00";
  const abs = Math.abs(num);
  return abs > 999999999
    ? "-"
    : abs > 999999
    ? (num / 1000000).toFixed(0) + "m"
    : abs > 999
    ? (num / 1000).toFixed(0) + "k"
    : num;
};

const stick = (num: number) => {
  if (num < 1) return num;
  let mult = 0;
  while (num % 10 === 0) {
    mult += 1;
    num /= 10;
  }

  if (num < 10) return num * 10 ** mult;
  const lastDigit = num % 10;
  if (lastDigit === 4 || lastDigit === 9) return (num + 1) * 10 ** mult;
  if (lastDigit === 6 || lastDigit === 1) return (num - 1) * 10 ** mult;
  return num * 10 ** mult;
};

export const R = (amount: number, strength = 1): number => {
  if (!amount || typeof amount !== "number" || strength > 5) return 0;
  if (amount > 100 && strength > 1) {
    const res = +(
      +(amount / 10 ** amount.toFixed(0).length).toFixed(6 - strength) *
      10 ** amount.toFixed(0).length
    ).toFixed(0);

    return stick(res);
  }

  // нахожу минимальный значимый порядок числа
  // это такое число, в которое нужно возвести десятку, чтобы получить тысячную долю amount
  const orderOfMagnitude = -Math.floor(
    Math.log10(amount / 10 ** (4 - (strength > 3 ? 3 : strength)))
  );
  //  округляем только часть после точки до порядка равного orderOfMagnitude
  return +amount.toFixed(orderOfMagnitude < 0 ? 0 : orderOfMagnitude);
};

export const format = (v: number, strength: number): string =>
  addSpaces(R(v, strength));

export const addSpaces = (x: string | number) => {
  const s = String(x);
  if (!x) return s;
  let parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  // if (!parts[1] && +x < 100) return parts[0] + ".00";
  return parts.join(".");
};

export const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) / a < 0.2;

export const beautifyAmount = (number: number, currency: string) =>
  addSpaces(R(number) + " " + currency);
