class MoneyPredicates {
  #negate: boolean
  constructor() {
    this.#negate = false
  }
  _isPositive(value: number): boolean {
    return !this.#negate ? value > 0 : !(value > 0)
  }
  _isNegative(value: number): boolean {
    return !this.#negate ? value < 0 : !(value < 0)
  }
  _isZero(value: number) {
    return value === 0
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
    }
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
  addMany(...vals: Money[]): Money {
    const sum = vals.reduce(
      (sum: Money, val: Money): Money => sum.add(val),
      this
    )
    return sum
  }
  subtractMany(...vals: Money[]): Money {
    const sum = vals.reduce(
      (sum: Money, val: Money): Money => sum.subtract(val),
      this
    )
    return sum
  }

  /** comparison operators */
  isPositive() {
    return this._isPositive(this.cents)
  }
  isNegative() {
    return this._isNegative(this.cents)
  }
  isZero() {
    return this._isZero(this.cents)
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
