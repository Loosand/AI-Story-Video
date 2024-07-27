"use client"

import { Trash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { useAddWord } from "../api/add-word"
import { useGetWords } from "../api/get-words"
import { useDeleteWord } from "../api/delete-word"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { showWarningToast } from "@/components/ui/toast"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

export function WordPage() {
	const [value, setValue] = useState("")

	const { run: addWord } = useAddWord()
	const { run: deleteWord } = useDeleteWord()
	const { data, run: getWords, loading: getWordsLoading } = useGetWords()

	const words = useMemo(() => {
		return data ?? []
	}, [data])

	useEffect(() => {
		console.log("DATABASE_URL:", process.env.DATABASE_URL)
	}, [])

	const handleAddWord = () => {
		if (value.trim() === "") {
			showWarningToast("请输入敏感词")
			return
		}
		addWord(value.trim())
		setValue("")
		getWords()
	}

	const handleDeleteWord = (wordId: string) => {
		deleteWord(wordId)
		getWords()
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

			{getWordsLoading ? (
				<LoadingSkeleton />
			) : (
				<>
					{!!words.length ? (
						<div className="mt-10 flex flex-wrap gap-4">
							{words.map((word) => (
								<Button
									key={word.id}
									variant="destructive"
									onClick={() => {
										handleDeleteWord(word.id)
									}}>
									<Trash className="mr-2 size-4" /> {word.word}
								</Button>
							))}
						</div>
					) : (
						<div className="mt-10 rounded-md py-36 text-center outline-dashed">
							暂无敏感词
						</div>
					)}
				</>
			)}
		</section>
	)
}
