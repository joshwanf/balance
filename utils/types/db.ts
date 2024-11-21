namespace DB {
  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    username: string
    hashedPassword: string
  }
  interface Transaction {
    id: string
    name: string
    amount: number
    date: Date
    receiptUrl?: string
  }
}
