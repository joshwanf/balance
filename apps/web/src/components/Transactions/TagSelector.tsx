"use client"
import { useState } from "react"
import { InputWithSelector } from "../../lib/ComponentLibrary/InputDropdownSelector/InputWithSelector"
import {
  addTransactionTagsAction,
  removeTransactionTagsAction,
} from "@/server/actions/transaction"

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
  const [selectedTags, setSelectedTags] = useState<string[]>(transactionTags)
  const [tags, setTags] = useState(allTags)

  const addTagToTransaction = async (newTags: string[]) => {
    const diff = newTags.filter(tag => !selectedTags.includes(tag))
    const result = await addTransactionTagsAction(transactionId, diff)
    if (result.status === "error") return setSelectedTags(selectedTags)
    setTags([...new Set([...tags, ...diff])])
  }

  const removeTagFromTransaction = async (newTags: string[]) => {
    const diff = selectedTags.filter(tag => !newTags.includes(tag))
    const result = await removeTransactionTagsAction(transactionId, diff)
    if (result.status === "error") setSelectedTags(selectedTags)
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
