export const getFormData = (form: FormData, key: string): string => {
  return form.get(key)?.toString() ?? ""
}
