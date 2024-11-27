class MoneyPredicates {
  // isPostive: () => boolean
  // isNegative: () => boolean
  // isZero: () => boolean
  constructor() {}
}

/**
 * Money class for working with money and decimals.
 * Assume all Money values are strings from the API
 */

export class Money extends MoneyPredicates {
  private value: string
  private currencySymbol: string
  s: string
  #meta: {
    cents: number
    dollars: number
    isNegative: boolean
    negate: boolean
  }

  constructor(input: string | number) {
    super()
    this.value = "input"
    this.currencySymbol = ""
    this.#meta = {
      cents: 0,
      dollars: 0,
      isNegative: false,
      negate: false,
    }
    this.#cleanIncoming(input)
    this.s = this.#toDisplay()
  }

  static parse(value: string): Money {
    return new Money(value)
  }
  static fromCents(value: string): Money {
    return new Money((Number(value) / 100).toString())
  }
  /**
   * Clean incoming decimal-like values to simple string representation of the value
   * Should treat:
   * - `"100"` === `"100.00"`
   * - `"100.5"` === `"100.50"`
   */
  #cleanIncoming(input: string | number) {
    /**
     * Valid money string should have:
     * - optional currency symbol first, otherwise only numbers. Cannot send first char `.`
     * -
     */

    // monkey patch after changing db money types from string to integer
    const strInput = typeof input === "number" ? input.toString() : input

    const validMoneyString = strInput.match(
      /^[\d\$\-][0-9]*[0-9\.]{0,1}[0-9]*$/g,
    )
    if (!validMoneyString) {
      // remove all but first `.`?
      return "not a number"
    }
    /** check if first char is negative sign */
    const startsWithNegSym = strInput.startsWith("-")
    if (startsWithNegSym) {
      this.#meta.isNegative = true
    } else {
      this.#meta.isNegative = false
    }
    const withNoNeg = startsWithNegSym ? strInput.slice(1) : strInput

    /** check if next char is symbol */
    // const startsWithCurSym = withNoNeg.match(/^[^0-9][0-9\.]*$/g)
    const startsWithCurSym = isNaN(Number(withNoNeg[0]))
    if (startsWithCurSym) {
      this.currencySymbol = withNoNeg[0]
    } else {
      this.currencySymbol = "$"
    }
    const withNoNegCur = startsWithCurSym ? withNoNeg.slice(1) : withNoNeg

    const decimalIndex = withNoNegCur.indexOf(".")
    const decimalPlacesFromEnd = withNoNegCur.length - 1 - decimalIndex
    const negSignPrefix = this.#meta.isNegative ? "-" : ""
    if (decimalIndex < 0) {
      // no decimal, so no cents
      this.value = `${negSignPrefix}${withNoNegCur}.00`
    } else if (decimalPlacesFromEnd >= 2) {
      this.value = Number(`${negSignPrefix}${withNoNegCur}`).toFixed(2)
    } else {
      this.value = `${negSignPrefix}${withNoNegCur}0`
    }
    this.#meta.cents = Number(this.value) * 100
  }

  /** Returns formatted string for display */
  #toDisplay() {
    const negSignPrefix = this.#meta.isNegative ? "-" : ""
    const dollarsValue = this.#meta.cents / 100
    const displayValue = this.#padZeros(
      dollarsValue.toString().replace("-", ""),
    )
    return `${negSignPrefix}${this.currencySymbol}${displayValue}`
  }

  /** math operators/functions */
  add(val: Money): Money {
    const sum = this.#meta.cents + val.#meta.cents
    return Money.fromCents(this.#padZeros(sum.toString()))
  }
  addMany(...vals: Money[]): Money {
    const sum = vals.reduce(
      (sum: Money, val: Money): Money => sum.add(val),
      this,
    )
    return sum
  }

  /** comparison operators */
  /** very hackey money.not.<comparison operator> */
  get not() {
    // this.#meta.negate = true
    this.#meta.negate = !this.#meta.negate
    return this
  }
  /** Check if Money value is greater than operand value */
  gt(operand: Money) {
    if (this.#meta.negate) {
      this.#meta.negate = false
      return !(this.#meta.cents > operand.#meta.cents)
    }
    return this.#meta.cents > operand.#meta.cents
  }
  gte(operand: Money) {
    if (this.#meta.negate) {
      this.#meta.negate = false
      return !(this.#meta.cents >= operand.#meta.cents)
    }
    return this.#meta.cents >= operand.#meta.cents
  }
  lt(operand: Money) {
    if (this.#meta.negate) {
      this.#meta.negate = false
      return !(this.#meta.cents < operand.#meta.cents)
    }
    return this.#meta.cents < operand.#meta.cents
  }
  lte(operand: Money) {
    if (this.#meta.negate) {
      this.#meta.negate = false
      return !(this.#meta.cents <= operand.#meta.cents)
    }
    return this.#meta.cents <= operand.#meta.cents
  }
  equals(operand: Money) {
    if (this.#meta.negate) {
      this.#meta.negate = false
      return !(this.#meta.cents === operand.#meta.cents)
    }
    return this.#meta.cents === operand.#meta.cents
  }
  #padZeros(input: string): string {
    const decimalIndex = input.indexOf(".")
    const decimalPlacesFromEnd = input.length - 1 - decimalIndex
    if (decimalPlacesFromEnd === 2) {
      return input
    } else if (decimalIndex < 0) {
      // no decimal, so no cents
      return `${input}.00`
    } else if (decimalPlacesFromEnd > 2) {
      return input.slice(0, decimalPlacesFromEnd + 2)
    } else {
      return `${input}0`
    }
  }
}

const income = Money.fromCents("10000")
const expense = Money.parse("-25")
// console.log(income.addMany(expense, expense, expense)) // $75.00

// const values = [
//     "", // ''
//     "100",
//     "100.5",
//     "100.50",
//     "100.550",
//   "$100",
//   "$100.5",
//   "$100.50",
//   "$100.550",
// ]
// const hasOnlyOneSep = values.map(v => {
//   const money = new Money(v)
//   return money
// })
// console.log(hasOnlyOneSep)

// console.log(Number("100.550").toFixed(2))
