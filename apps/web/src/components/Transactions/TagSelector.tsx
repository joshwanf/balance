"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { InputWithSelector } from "../../lib/ComponentLibrary/InputDropdownSelector/InputWithSelector"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { useAppDispatch } from "../../store/hooks"
import { addTagsToT, removeTagsFromT } from "../../features/transactionsSlice"

interface Props {
  transactionId: string
  transactionTags: string[]
  allTags: string[]
}
export const TagSelector = ({
  transactionId,
  transactionTags,
  allTags,
}: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>(transactionTags)
  const [tags, setTags] = useState(allTags)

  const addTagToTransaction = async (newTags: string[]) => {
    const diff = newTags.filter(tag => !selectedTags.includes(tag))
    const res = await balance.tag.add(transactionId, diff)
    if (res instanceof ApiError) {
      console.log("error adding tag")
    }
    dispatch(addTagsToT({ id: transactionId, tags: diff }))
    setTags([...new Set([...tags, ...diff])])
    router.refresh()
  }

  const removeTagFromTransaction = async (newTags: string[]) => {
    const diff = selectedTags.filter(tag => !newTags.includes(tag))
    const res = await balance.tag.remove(transactionId, diff)
    if (res instanceof ApiError) {
      console.log("error removing tag")
    }
    dispatch(removeTagsFromT({ id: transactionId, tags: diff }))
    router.refresh()
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
