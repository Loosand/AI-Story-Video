"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { ArticleCard } from "../components/ArticleCard"

import { buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const ARTICLES = [
	{
		id: "1",
		title: "AAAAAAA",
		content:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident velit temporibus cum, deleniti quod eligendi porro eaque libero hic beatae, et voluptatum quia quis excepturi neque accusantium deserunt quo distinctio?",
	},
	{
		id: "2",
		title: "123",
		content:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident velit temporibus cum, deleniti quod eligendi porro eaque libero hic beatae, et voluptatum quia quis excepturi neque accusantium deserunt quo distinctio?",
	},
	{
		id: "3",
		title: "123",
		content:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident velit temporibus cum, deleniti quod eligendi porro eaque libero hic beatae, et voluptatum quia quis excepturi neque accusantium deserunt quo distinctio?",
	},
]

export function ArticlePage() {
	const [article, setArticle] = useState("")

	return (
		<section className="w-full space-y-6 md:px-20">
			<section className="space-y-6 ">
				<Textarea
					value={article}
					onChange={(e) => {
						setArticle(e.target.value)
					}}
					placeholder="输入你的文章"
					className="min-h-60"
				/>
				{article && (
					<Link
						href={`/article/edit?article=${JSON.stringify(article)}`}
						className={cn(buttonVariants(), "w-full")}>
						去清洗敏感词
					</Link>
				)}
			</section>

			<section className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<Card className="flex items-center justify-center hover:bg-accent/90">
					<Link href="edit">
						<Plus size={60} />
					</Link>
				</Card>
				{ARTICLES.map((article) => {
					return (
						<ArticleCard key={article.id} {...article}>
							<p className="h-60 overflow-scroll py-4">{article.content}</p>
						</ArticleCard>
					)
				})}
			</section>
		</section>
	)
}
