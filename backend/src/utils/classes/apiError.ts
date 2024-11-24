export class ApiError {
  constructor(public err: Error, public status: number) {
    Object.seal(this)
  }
}
