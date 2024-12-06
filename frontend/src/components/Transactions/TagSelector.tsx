import { useState } from "react"
import { InputWithSelector } from "../../lib/ComponentLibrary/InputDropdownSelector/InputWithSelector"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addTagsToT,
  removeTagsFromT,
  selectTags,
} from "../../features/transactionsSlice"

interface Props {
  transactionId: string
  transactionTags: string[]
}
export const TagSelector: React.FC<Props> = props => {
  const { transactionId, transactionTags, ...rest } = props
  const dispatch = useAppDispatch()
  const [selectedTags, setSelectedTags] = useState<string[]>(transactionTags)
  const tags = useAppSelector(selectTags)

  const addTagToTransaction = async (newTags: string[]) => {
    const diff = newTags.filter(tag => !selectedTags.includes(tag))
    const res = await balance.tag.add(transactionId, diff)
    if (res instanceof ApiError) {
      console.log("error adding tag")
    }
    dispatch(addTagsToT({ id: transactionId, tags: diff }))
  }

  const removeTagFromTransaction = async (newTags: string[]) => {
    const diff = selectedTags.filter(tag => !newTags.includes(tag))
    const res = await balance.tag.remove(transactionId, diff)
    if (res instanceof ApiError) {
      console.log("error removing tag")
    }
    dispatch(removeTagsFromT({ id: transactionId, tags: diff }))
  }

  const handleChangeTag = async (newTags: string[]) => {
    setSelectedTags(newTags)
    if (newTags.length > selectedTags.length) {
      await addTagToTransaction(newTags)
    } else if (newTags.length < selectedTags.length) {
      await removeTagFromTransaction(newTags)
    }
  }
  return (
    <InputWithSelector
      list={tags}
      selected={selectedTags}
      setSelected={handleChangeTag}
    />
  )
}
