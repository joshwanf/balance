export const validateEmail = (input: string): boolean => {
  return /.+@.+\..+/.test(input)
}
