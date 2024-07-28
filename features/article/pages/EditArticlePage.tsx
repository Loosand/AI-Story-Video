"use client"

import { useEffect, useMemo, useState } from "react"
import pinyin from "pinyin"
import { Loader2, Pen, Trash } from "lucide-react"

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
import { useDeleteWord } from "@/features/word/api/delete-word"

export interface ArticleData {
	summary: string
	titles: string[]
	types: string[]
	token: number
}

export function EditArticlePage() {
	const { run: addWord } = useAddWord()
	const { run: getWords, data } = useGetWords()
	const { run: deleteWord } = useDeleteWord()
	const [value, setValue] = useState("")
	const [content, setContent] = useState(ARTICLE)
	const [hasSensitiveWord, setHasSensitiveWord] = useState(true)
	const [generating, setGenerating] = useState(false)
	const [articleData, setArticleData] = useState<ArticleData>()
	const [selectedText, setSelectedText] = useState("")
	const [menuVisible, setMenuVisible] = useState(false)
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

	const words = useMemo(() => {
		return data ?? []
	}, [data])

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

			{articleData && (
				<ul className="space-y-4 [&>li]:space-y-2">
					<li>
						<h2 className="text-xl font-bold">总结</h2>
						<p>{articleData?.summary}</p>
					</li>
					<li>
						<h2 className="text-xl font-bold">标题</h2>
						<div className="space-x-4">
							{articleData?.titles.map((title, index) => {
								return (
									<span
										key={index}
										className="rounded-md bg-gray-200 px-2 py-1">
										{title}
									</span>
								)
							})}
						</div>
					</li>
					<li>
						<h2 className="text-xl font-bold">类型</h2>
						<div className="space-x-4">
							{articleData?.types.map((type, index) => {
								return (
									<span
										key={index}
										className="rounded-md bg-gray-200 px-2 py-1">
										{type}
									</span>
								)
							})}
						</div>
					</li>
				</ul>
			)}

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

const ARTICLE = `
京圈太子爷破天荒发了一张腹肌照火了，配文：「晚上等你。」
当红小花隔空回应：「今晚会早点回家。」
一夜之间，全网疯狂磕 CP：「太甜了，这就是官宣吧。」
可是，如果她是官宣女友，那我是谁？
1
我是娱乐圈臭名昭著的黑红女星。
最近运气比较背，连着几部热播剧都因为其他演员犯事被禁了。
我心情不好，无心拍戏。
经纪人顺势帮我接了一档直播综艺。
受邀的飞行嘉宾除了我之外，还有当红流量小花苏琪。
京圈太子爷宋屿辞的新晋绯闻女友，也是我的对家。
正式开播后，主持人让我们和观众打招呼。
苏琪率先开口，一身淡蓝色连衣裙，嗓音甜美：「大家好，我是你们的琪琪呀。」
主持人坏笑着补充：「也许过段时间，可以改口叫宋夫人了哦。」
起哄声中，苏琪低下头，羞涩一笑：「还早啦。」
我没忍住皱了皱眉。
但出于礼貌，并没有打断苏琪讲话。
听到笑声后，主持人这才注意到我的存在，不走心的随口问道：
「陈柠，你准备好投屏了吗？」
我正要点头，猛的想到什么，下意识握紧了手机：「可以稍微等一下吗？」
苏琪温柔的宽慰，眼中却闪过一丝嘲讽：「陈柠姐，别有压力，邀请到小演员我们也会很开心的。」
见我迟迟没有动作，主持人有点烦躁：「陈柠是不是刚刚玩游戏太累了，没事，我来帮你。」
主持人从我手里夺过手机。
大屏幕上映入眼帘的是男人性感的轮廓线条，淡粉色的唇瓣轻抿着。
冷淡又充满性张力。
虽然只露出了下半张脸，弹幕中还是有人一眼便认出了：
「这不是宋哥吗？陈柠怎么用宋哥的照片做壁纸？」
「好家伙，原来陈绿茶是宋哥的梦女。怪不得对我们琪宝敌意那么重。果然，唯粉只对真嫂子破防。」
「可是这张照片全网都搜不到诶。为什么陈柠会有，我现在越来越觉得这两人不会真的有什么吧……」
「真个屁，这一眼就是 P 的。要我说，干脆让陈柠也邀请宋哥好了，琪琪太善良，让宋哥本人过来灭灭她的嚣张气焰。」
「哈哈哈，楼上真他娘的是个人才，这么损的招我怎么没想到呢。对，让她邀！欺负宋哥的女人，还敢 P 图恶心宋哥，我已经迫不及待看陈绿茶身败名裂了。」
「支持陈柠邀请宋哥。」的弹幕不断刷屏。
4
主持人和其他嘉宾一副等着看乐子的表情。
只有苏琪主动凑过来。
她刚刚邀请受挫，急于从我身上找回场子：
「陈柠姐，观众已经做出选择了，你怎么还不给屿辞发消息。」
几秒后，她恍然大悟般小声道歉：
`
