"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { useMemo } from "react"

import { ArticleCard } from "../components/ArticleCard"
import { useGetArticles } from "../api/get-articles"
import { useDeleteArticle } from "../api/delete-article"

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
	const { run: getArticles, data: getArticlesQuery } = useGetArticles()
	const { run: deleteArticle } = useDeleteArticle()

	const articles = useMemo(() => {
		return getArticlesQuery ?? []
	}, [getArticlesQuery])

	return (
		<section className="w-full space-y-6 md:px-20">
			<section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
				<Card className="flex items-center justify-center hover:bg-accent/90">
					<Link href={"/article/edit/null"}>
						<Plus size={60} />
					</Link>
				</Card>
				{articles.map((article) => {
					return (
						<ArticleCard
							key={article.id}
							{...article}
							onDelete={() => {
								deleteArticle(article.id)
								getArticles()
							}}>
							<p className="h-80 overflow-scroll">{article.content}</p>
						</ArticleCard>
					)
				})}
			</section>
		</section>
	)
}
