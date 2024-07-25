"use client"

import { Trash } from "lucide-react"
import { useMemo, useState } from "react"

import { useAddWord } from "../api/add-word"
import { useGetWords } from "../api/get-words"
import { useDeleteWord } from "../api/delete-word"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { showWarningToast } from "@/components/ui/toast"

export function WordPage() {
	const [value, setValue] = useState("")

	const { run: addWord } = useAddWord()
	const { run } = useDeleteWord()
	const getWordsQuery = useGetWords()

	const tags = useMemo(() => {
		return getWordsQuery.data ?? []
	}, [getWordsQuery])

	const handleAddWord = () => {
		if (value.trim() === "") {
			showWarningToast("请输入敏感词")
			return
		}
		addWord(value.trim())
		setValue("")
		getWordsQuery.run()
	}

	const handleDeleteWord = (wordId: string) => {
		run(wordId)
		getWordsQuery.run()
	}

	return (
		<section>
			<div className="flex items-center gap-2">
				<Input
					type="text"
					placeholder="添加敏感词"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button type="submit" onClick={handleAddWord}>
					添加词
				</Button>
			</div>

			<div className="mt-10 flex flex-wrap gap-4">
				{tags.map((tag) => (
					<Button
						key={tag.id}
						variant="destructive"
						onClick={() => {
							handleDeleteWord(tag.id)
						}}>
						<Trash className="mr-2 size-4" /> {tag.word}
					</Button>
				))}
			</div>
		</section>
	)
}
