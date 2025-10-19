import { AmountInput, AmountOutputs } from "../types/amount";
import { IRate } from "../types/rates";

export const codeToSymbol = (code: string) =>
  curNames[code.toLowerCase() as keyof typeof curNames]?.symbol || "";

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

    outputs[oppositeSide] =
      calculatedAmount > 0 ? addSpaces(String(R(calculatedAmount))) : "";

    const input = Number.isNaN(+str)
      ? ""
      : str.endsWith(".") || str.endsWith("0") || str === ""
      ? str
      : String(R(+str));

    outputs[side] = addSpaces(input) || "";

    return outputs;
  };

  _calculateFee = (): number => {
    const { side, num } = this.amountInput;
    let to_fee,
      from_fee,
      course = 0;
    try {
      ({ to_fee, from_fee, course } = this.rate);
    } catch (e) {}
    if (!course || !num) return 0;
    if (side === "give") {
      if (!from_fee && !to_fee) return num / course;
      const inMinusFromFee = this._removeFromFee(num);
      return this._removeToFee(inMinusFromFee / course);
    }
    if (side === "get") {
      if (!from_fee && !to_fee) return num * course;
      const outPlusToFee = this._addToFee(num);
      return this._addFromFee(outPlusToFee * course);
    }
    return 0;
  };

  _addFromFee = (customIn: number) => {
    const { from_fee, course } = this.rate;
    if (!from_fee) return customIn;
    const [feeStr, symbol] = from_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customIn / (1 - fee / 100);
    if (this.giveCode.includes(symbol)) return customIn + fee;
    if (this.getCode.includes(symbol)) return customIn + fee * course;
    return customIn;
  };

  _addToFee = (customOut: number) => {
    const { to_fee, course } = this.rate;
    if (!to_fee) return customOut;
    const [feeStr, symbol] = to_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customOut / (1 - fee / 100);
    if (this.getCode.includes(symbol)) return customOut + fee;
    if (this.giveCode.includes(symbol)) return customOut + fee / course;
    return customOut;
  };

  _removeFromFee = (customIn: number) => {
    const { from_fee, course } = this.rate;
    if (!from_fee) return customIn;
    const [feeStr, symbol] = from_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customIn * (1 - fee / 100);
    if (this.giveCode.includes(symbol))
      return fee > customIn ? 0 : customIn - fee;
    if (this.getCode.includes(symbol))
      return fee * course > customIn ? 0 : customIn - fee * course;
    return customIn;
  };

  _removeToFee = (customOut: number) => {
    const { to_fee, course } = this.rate;
    if (!to_fee) return customOut;
    const [feeStr, symbol] = to_fee.split(" ");
    const fee = +feeStr;
    if (symbol && symbol === "%") return customOut * (1 - fee / 100);
    if (this.getCode.includes(symbol))
      return fee > customOut ? 0 : customOut - fee;
    if (this.giveCode.includes(symbol))
      return fee / course > customOut ? 0 : customOut - fee / course;
    return customOut;
  };
}

export const kFormatter = (num: number, locale?: "en" | "ru") => {
  const abs = Math.abs(num);
  if (abs <= 1000) return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);

  return abs > 999999999
    ? "✖"
    : abs > 9999999
    ? (num / 1000000).toFixed(0) + (locale == "en" ? " m" : " млн")
    : abs > 999999
    ? (num / 1000000).toFixed(1) + (locale == "en" ? " m" : " млн")
    : abs > 9999
    ? (num / 1000).toFixed(0) + (locale == "en" ? " k" : " тыс")
    : abs > 999
    ? (num / 1000).toFixed(1) + (locale == "en" ? " k" : " тыс")
    : num.toString();
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

  if (amount >= 1 && amount <= 1000) {
    const hasDecimal = amount % 1 !== 0;
    return hasDecimal ? +amount.toFixed(2) : amount;
  }

  if (amount > 100 && strength > 1) {
    const res = +(
      +(amount / 10 ** amount.toFixed(0).length).toFixed(6 - strength) *
      10 ** amount.toFixed(0).length
    ).toFixed(0);
    return stick(res);
  }

  const orderOfMagnitude = -Math.floor(
    Math.log10(amount / 10 ** (4 - (strength > 3 ? 3 : strength)))
  );

  return +amount.toFixed(orderOfMagnitude < 0 ? 0 : orderOfMagnitude);
};

export const format = (v: number, strength?: number): string =>
  addSpaces(R(v, strength));

export const addSpaces = (x: string | number) => {
  const s = String(x);
  if (!x && x !== 0) return s;
  if (s.length > 9) return "✖";
  let parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

export const isClose = (a: number, b: number): boolean =>
  Math.abs(a - b) / a < 0.2;

export const beautifyAmount = (number: number, currency: string) =>
  addSpaces(R(number) + " " + currency);

export const localFormat = (n: number, cur: string, locale?: "en" | "ru") => {
  return `${kFormatter(R(n, 2), locale)} ${
    curNames?.[cur.toLocaleLowerCase() as keyof typeof curNames]?.symbol || ""
  }`;
};

export const curToSymbol = (cur?: string) => {
  return cur
    ? curNames?.[cur.toLocaleLowerCase() as keyof typeof curNames]?.symbol
    : "";
};

export function powerOfTenOrder(num?: number): number {
  if (!num || num === 0) return 0;

  const absoluteNum = Math.abs(num);
  const exponent = Math.floor(Math.log10(absoluteNum));

  return Math.pow(10, exponent);
}

export const curNames = {
  usd: {
    symbol: "$",
    ru_name: "доллары",
    en_name: "dollars",
  },
  rub: {
    symbol: "₽",
    ru_name: "рубли",
    en_name: "rubles",
  },
  uah: {
    symbol: "₴",
    ru_name: "гривны",
    en_name: "hryvnias",
  },
  eur: {
    symbol: "€",
    ru_name: "евро",
    en_name: "euros",
  },
  gbp: {
    symbol: "£",
    ru_name: "фунты",
    en_name: "pounds",
  },
  gel: {
    symbol: "₾",
    ru_name: "лари",
    en_name: "lari",
  },
  try: {
    symbol: "₺",
    ru_name: "лиры",
    en_name: "lira",
  },
  thb: {
    symbol: "฿",
    ru_name: "баты",
    en_name: "baht",
  },
  inr: {
    symbol: "₹",
    ru_name: "рупии",
    en_name: "rupees",
  },
  jpy: {
    symbol: "¥",
    ru_name: "иены",
    en_name: "yen",
  },
  cny: {
    symbol: "¥",
    ru_name: "юани",
    en_name: "yuan",
  },
};
