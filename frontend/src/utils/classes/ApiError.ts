type Error = {
  title: string
  status: number
  message?: any
  error?: any
}
export class ApiError {
  constructor(
    public err: Error,
    public status: number,
  ) {
    Object.seal(this)
  }
}
