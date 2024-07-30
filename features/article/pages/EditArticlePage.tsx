"use client"

import { useEffect, useMemo, useState } from "react"
import pinyin from "pinyin"
import { Loader2, Pen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

import { updateArticle } from "../actions/index"
import { useUpdateArticle } from "../api/update-article"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BytemdEditor } from "@/components/bytemd"
import { useGetWords } from "@/features/word/api/get-words"
import { generateArticleData } from "@/utils/pipeline/summary"
import { useAddWord } from "@/features/word/api/add-word"
import { showWarningToast } from "@/components/ui/toast"
import { useAddArticle } from "@/features/article/api/add-article"
import { useDeleteWord } from "@/features/word/api/delete-word"
import { Select } from "@/components/ui/select"

export interface ArticleData {
	summary: string
	titles: string[]
	types: string[]
	token: number
}

export function EditArticlePage({
	id,
	article,
}: {
	id: string
	article?: {
		id: string
		title: string
		description: string
		type: string
		content: string
		status: string
	}
}) {
	const router = useRouter()
	const { run: addWord } = useAddWord()
	const { run: getWords, data: getWordsQuery } = useGetWords()
	const { run: deleteWord } = useDeleteWord()
	const { run: addArticle } = useAddArticle()
	const { run: updateArticle } = useUpdateArticle()

	const [value, setValue] = useState("")
	const [content, setContent] = useState(article?.content || "")
	const [hasSensitiveWord, setHasSensitiveWord] = useState(true)
	const [generating, setGenerating] = useState(false)
	const [articleData, setArticleData] = useState<ArticleData>({
		summary: article?.description || "",
		titles: article?.title ? [article.title] : [""],
		types: article?.type ? [article.type] : [""],
		token: 0,
	})
	const [selectedText, setSelectedText] = useState("")
	const [menuVisible, setMenuVisible] = useState(false)
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

	const words = useMemo(() => {
		return getWordsQuery ?? []
	}, [getWordsQuery])

	function matchWord() {
		if (words && content) {
			let highlightedContent = content
			const sensitiveWords = words.filter((item) => content.includes(item.word))
			setHasSensitiveWord(sensitiveWords.length > 0)

			words.forEach((item) => {
				const regex = new RegExp(item.word, "gi")
				highlightedContent = highlightedContent.replace(
					regex,
					`<mark>${item.word}</mark>`
				)
			})

			setContent(highlightedContent)
		}
	}

	function replaceWithPinyin(content: string): string {
		const regex = /<mark>(.*?)<\/mark>/gi

		const replacedContent = content.replace(regex, (_, word) => {
			const pinyinWord = pinyin(word, {
				style: pinyin.STYLE_NORMAL,
			})
			return pinyinWord.join("")
		})

		setHasSensitiveWord(replacedContent === content)

		return replacedContent
	}

	async function handleGenerateArticleData(article: string) {
		setGenerating(true)
		generateArticleData({ article })
			.then((res) => {
				console.log("文章数据生成成功:", res)
				setArticleData(JSON.parse(res as string))
			})
			.catch((error) => {
				console.error("生成文章数据时出错:", error)
			})
			.finally(() => {
				setGenerating(false)
			})
	}

	function handleDeleteWord(wordId: string) {
		deleteWord(wordId)
		getWords()
	}

	function handleAddWord() {
		if (value.trim() === "") {
			showWarningToast("请输入敏感词")
			return
		}
		addWord(value.trim())
		setValue("")
		getWords()
	}

	useEffect(() => {
		const handleMouseUp = () => {
			const selection = window?.getSelection()
			const text = selection ? selection.toString() : ""
			setSelectedText(text)
		}

		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault()
			setMenuPosition({ x: e.pageX, y: e.pageY })
			setMenuVisible(true)
		}

		document.addEventListener("mouseup", handleMouseUp)
		document.addEventListener("contextmenu", handleContextMenu)

		return () => {
			document.removeEventListener("mouseup", handleMouseUp)
			document.removeEventListener("contextmenu", handleContextMenu)
		}
	}, [])

	useEffect(() => {
		if (selectedText.length <= 0) {
			setMenuVisible(false)
		}
	}, [selectedText])

	return (
		<section className="space-y-6">
			<header className="flex justify-between">
				<div className="space-x-6">
					<Button onClick={matchWord}>匹配敏感词</Button>
					<Button
						disabled={!hasSensitiveWord}
						onClick={() => {
							setContent((pre) => replaceWithPinyin(pre))
						}}>
						一键替换为拼音
					</Button>

					<Button
						disabled={generating}
						onClick={() => {
							handleGenerateArticleData(content)
						}}>
						{generating && <Loader2 className="mr-2 size-4 animate-spin" />}
						生成标题、概述、类型
					</Button>
				</div>

				<span className="flex w-fit items-center gap-2">
					<Input
						type="text"
						placeholder="回车后添加敏感词"
						value={value}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleAddWord()
							}
						}}
						onChange={(e) => setValue(e.target.value)}
					/>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">敏感词管理</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>管理敏感词</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								{!!words.length ? (
									<div className="mx-auto flex w-fit flex-wrap gap-4">
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
							</div>
							<DialogFooter>
								<Button>关闭</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</span>
			</header>

			<div id="content-editor">
				<BytemdEditor body={content} setContent={setContent} />
			</div>

			<div className="flex">
				{articleData && (
					<ul className="space-y-4 [&>li]:space-y-2">
						<li>
							<h2 className="text-xl font-bold">标题</h2>
							<div className="flex space-x-4">
								{articleData.titles.map((title, index) => {
									return (
										<Input
											key={index}
											value={title}
											className="w-fit"
											onChange={(e) => {
												const newTitles = articleData.titles.map((item, i) => {
													if (i === index) {
														return e.target.value
													}
													return item
												})
												setArticleData((pre) => ({ ...pre, titles: newTitles }))
											}}
										/>
									)
								})}
							</div>
						</li>
						<li>
							<h2 className="text-xl font-bold">总结</h2>
							<Input
								value={articleData.summary}
								onChange={(e) => {
									setArticleData((pre) => ({ ...pre, summary: e.target.value }))
								}}
							/>
						</li>
						<li>
							<h2 className="text-xl font-bold">类型</h2>
							<div className="flex space-x-4">
								{articleData.types.map((type, index) => {
									return (
										<Input
											key={index}
											value={type}
											className="w-fit"
											onChange={(e) => {
												const newTypes = articleData.types.map((item, i) => {
													if (i === index) {
														return e.target.value
													}
													return item
												})
												setArticleData((pre) => ({ ...pre, types: newTypes }))
											}}
										/>
									)
								})}
							</div>
						</li>
					</ul>
				)}

				<Button
					className="ml-auto"
					onClick={() => {
						if (!articleData.titles) {
							showWarningToast("请填写标题")
							return
						}

						if (!articleData.summary) {
							showWarningToast("请填写总结")
							return
						}

						if (!articleData.types) {
							showWarningToast("请填写类型")
							return
						}

						if (!content) {
							showWarningToast("请填写内容")
							return
						}

						if (id === "null") {
							addArticle(
								articleData.titles[0],
								articleData.summary,
								articleData.types[0],
								content
							)
							router.back()
						} else {
							updateArticle(
								id,
								articleData.titles[0],
								articleData.summary,
								articleData.types[0],
								content
							)
							router.back()
						}
					}}>
					保存文章
				</Button>
			</div>

			<menu>
				{menuVisible && (
					<ul
						style={{
							top: menuPosition.y,
							left: menuPosition.x,
							position: "absolute",
						}}>
						<li>
							<Button
								onClick={() => {
									addWord(selectedText)
									setMenuVisible(false)
									getWords()
								}}>
								添加到词库
							</Button>
						</li>
					</ul>
				)}
			</menu>
		</section>
	)
}
