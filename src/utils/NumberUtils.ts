import Decimal from "decimal.js";

export type NumberType = number | string | Decimal;

export class NumberUtils {
  static formatPrice(price: number) {
    return price.toFixed(2);
  }

  static add(a: NumberType, b: NumberType, precision = 2) {
    return new Decimal(a).add(b).toFixed(precision);
  }

  static minus(a: NumberType, b: NumberType, precision = 2) {
    return new Decimal(a).minus(b).toFixed(precision);
  }

  static multiply(a: NumberType, b: NumberType) {
    return new Decimal(a).mul(b);
  }

  static divide(a: NumberType, b: NumberType, precision = 2) {
    return new Decimal(a).div(b).toFixed(precision);
  }
}
