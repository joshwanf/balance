class MoneyPredicates {
  #negate: boolean
  constructor() {
    this.#negate = false
  }
  _isPositive(value: number): boolean {
    return !this.#negate ? value > 0 : !(value > 0)
  }
  isNegative(negSign: string) {
    return negSign.length > 0
  }
  isZero(dollars: number, cents: number) {
    return dollars === 0 && cents === 0
  }

  get not() {
    this.#negate = !this.#negate
    return this
  }
}

interface ParseOptions {
  currency: string
}
interface FormatOptions {
  type?: string
  noCurrencySymbol?: boolean
  noNegSign?: boolean
}
interface ValidMoneyConstructorInput {
  negSign: string
  curSymbol: string
  dollars: number
  cents: number
}

/**
 * Money class for working with money and decimals.
 * Assume all Money values are strings from the API
 */
export class Money extends MoneyPredicates {
  negSign: string
  cents: number
  dollars: number
  currencySymbol: string
  value: string

  private constructor(
    input: ValidMoneyConstructorInput = {
      negSign: "",
      curSymbol: "$",
      dollars: 0,
      cents: 0,
    },
  ) {
    super()
    const { negSign, curSymbol, dollars, cents } = input
    const isValidCurSymbol = curSymbol.length === 1
    if (!isValidCurSymbol) {
      throw "Currency symbol must be one character"
    }
    if (!Number.isInteger(dollars) || !Number.isInteger(cents)) {
      throw "Dollars and cents must be an integer"
    }

    const absCents = dollars * 100 + cents
    const absDollars = absCents / 100

    this.negSign = negSign
    this.currencySymbol = curSymbol
    this.cents = Number(`${negSign}${absCents}`)
    this.dollars = this.cents / 100
    this.value = this.dollars.toFixed(2)
  }

  static parse(value: string, options?: ParseOptions) {
    const validMoneyRegex = /^(\-){0,1}(\$){0,1}(\d+)((?:\.)\d{2}){0,1}$/
    const isValidString = validMoneyRegex.test(value)

    // [match, negSign, curSymbol, dollars, cents]
    const extracted = value.match(validMoneyRegex)
    if (!extracted || !isValidString) {
      throw `${value} is not valid money input`
    }
    const negSign = extracted[1] || ""
    const curSymbol = extracted[2] || "$"
    const dollars = Number(extracted[3])
    const cents = extracted[4] ? Number(extracted[4].slice(1)) : 0
    const moneyResult = new Money({ negSign, curSymbol, dollars, cents })
    return moneyResult
  }
  static fromCents(value: string) {
    const validMoneyRegex = /^(\-){0,1}(\$){0,1}(\d+)$/
    const isValidString = validMoneyRegex.test(value)

    // [match, negSign, curSymbol, cents]
    const extracted = value.match(validMoneyRegex)
    if (!extracted || !isValidString) {
      throw `${value} is not valid money input`
    }
    const negSign = extracted[1] || ""
    const curSymbol = extracted[2] || "$"
    const cents = Number(extracted[3])
    const moneyResult = new Money({ negSign, curSymbol, dollars: 0, cents })
    return moneyResult
  }
  /**
   * Clean incoming decimal-like values to simple string representation of the value
   * Should treat:
   * - `"100"` === `"100.00"`
   * - `"100.5"` === `"100.50"`
   */
  // #cleanIncoming(input: string | number) {
  //   /**
  //    * Valid money string should have:
  //    * - optional currency symbol first, otherwise only numbers. Cannot send first char `.`
  //    * -
  //    */

  //   // monkey patch after changing db money types from string to integer
  //   const strInput = typeof input === "number" ? input.toString() : input

  //   const validMoneyString = strInput.match(
  //     /^[\d\$\-][0-9]*[0-9\.]{0,1}[0-9]*$/g,
  //   )
  //   if (!validMoneyString) {
  //     // remove all but first `.`?
  //     return "not a number"
  //   }
  //   /** check if first char is negative sign */
  //   const startsWithNegSym = strInput.startsWith("-")
  //   if (startsWithNegSym) {
  //     this.#meta.isNegative = true
  //   } else {
  //     this.#meta.isNegative = false
  //   }
  //   const withNoNeg = startsWithNegSym ? strInput.slice(1) : strInput

  //   /** check if next char is symbol */
  //   // const startsWithCurSym = withNoNeg.match(/^[^0-9][0-9\.]*$/g)
  //   const startsWithCurSym = isNaN(Number(withNoNeg[0]))
  //   if (startsWithCurSym) {
  //     this.currencySymbol = withNoNeg[0]
  //   } else {
  //     this.currencySymbol = "$"
  //   }
  //   const withNoNegCur = startsWithCurSym ? withNoNeg.slice(1) : withNoNeg

  //   const decimalIndex = withNoNegCur.indexOf(".")
  //   const decimalPlacesFromEnd = withNoNegCur.length - 1 - decimalIndex
  //   const negSignPrefix = this.#meta.isNegative ? "-" : ""
  //   if (decimalIndex < 0) {
  //     // no decimal, so no cents
  //     this.value = `${negSignPrefix}${withNoNegCur}.00`
  //   } else if (decimalPlacesFromEnd >= 2) {
  //     this.value = Number(`${negSignPrefix}${withNoNegCur}`).toFixed(2)
  //   } else {
  //     this.value = `${negSignPrefix}${withNoNegCur}0`
  //   }
  //   this.#meta.cents = Number(this.value) * 100
  // }

  /** Returns formatted string for display */
  format(options: FormatOptions = {}) {
    const absCents = Math.abs(this.cents)
    const absDollars = (absCents / 100).toFixed(2)

    const { noCurrencySymbol, noNegSign } = options
    const negSign = noNegSign ? "" : this.negSign
    const currencySymbol = noCurrencySymbol ? "" : this.currencySymbol
    // if (options.noCurrencySymbol) {
    //   return `${negSign}${absDollars}`
    // }
    return `${negSign}${currencySymbol}${absDollars}`
  }
  toInt() {
    return this.cents
  }
  static isValidMoney(input: string) {
    const validMoneyRegex = /^(\-){0,1}(\$){0,1}(\d+)((?:\.)\d{2}){0,1}$/
    const isValidString = validMoneyRegex.test(input)
    return isValidString
  }

  /** math operators/functions */
  add(val: Money): Money {
    const sum = this.cents + val.cents
    return Money.fromCents(sum.toString())
  }
  subtract(val: Money): Money {
    const sum = this.cents - val.cents
    return Money.fromCents(sum.toString())
  }
  // addMany(...vals: Money[]): Money {
  //   const sum = vals.reduce(
  //     (sum: Money, val: Money): Money => sum.add(val),
  //     this,
  //   )
  //   return sum
  // }

  /** comparison operators */
  isPositive() {
    return this._isPositive(this.cents)
  }

  /** Check if Money value is greater than operand value */
  gt(operand: Money) {
    return this.cents > operand.cents
  }
  gte(operand: Money) {
    return this.cents >= operand.cents
  }
  lt(operand: Money) {
    return this.cents < operand.cents
  }
  lte(operand: Money) {
    return this.cents <= operand.cents
  }
  equals(operand: Money) {
    return this.cents === operand.cents
  }
}
