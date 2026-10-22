export type QueryParams = {
  startDate: string
  endDate: string
  tags: string[]
  generalSearch: string[]
  // [key: string]: string | string[]
} & Record<string, string | string[]>

export const searchTextToParams = (
  searchText: string,
): Partial<QueryParams> => {
  const regexSplit = /((\w+):("[^"]*"|\S+))|\w+/g
  const splitTerms = searchText.match(regexSplit) || []
  const params: Partial<QueryParams> = {}
  if (!splitTerms) {
    return params
  }

  const generalSearch = []
  for (const term of splitTerms) {
    const isKeyValuePair = /^\w+:[^:]+$/g.test(term)
    if (isKeyValuePair) {
      const [k, v] = term.split(":")
      if (k === "tags") {
        const tags = v
          .slice(1, -1)
          .split(",")
          .map(t => t.trim())
        params[k] = tags
      } else {
        params[k] = v
      }
    } else {
      generalSearch?.push(term)
    }
  }
  if (generalSearch.length > 0) {
    params.generalSearch = generalSearch
  }
  return params
}

export const searchParamsToText = (
  searchParams: Partial<QueryParams>,
): string => {
  const { generalSearch, tags, startDate, endDate } = searchParams
  const newParams: Record<string, string> = {}

  if (tags && tags.length > 0) {
    newParams.tags = `"${tags.join(", ")}"`
  }
  const newGeneralSearch = generalSearch ? generalSearch.join(" ") : ""
  const newStartDate = startDate ? `startDate:${startDate}` : ""
  const newEndDate = endDate ? `endMonth:${endDate}` : ""
  const newTags = tags && tags.length > 0 ? `tags:"${tags.join(", ")}"` : ""

  return [newGeneralSearch, newStartDate, newEndDate, newTags]
    .filter(term => term.length > 0)
    .join(" ")
}
