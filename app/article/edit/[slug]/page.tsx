import { EditArticlePage } from "@/features/article"
import { getArticle } from "@/features/article/actions"

export default async function Page({ params }: { params: { slug: string } }) {
	const article = await getArticle(params?.slug)

	return <EditArticlePage article={article as any} id={params.slug} />
}
