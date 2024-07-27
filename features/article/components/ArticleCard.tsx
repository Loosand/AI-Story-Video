import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export function ArticleCard({
	children,
	title,
}: {
	children?: React.ReactNode
	title: string
}) {
	return (
		<Card>
			<CardHeader className="overflow-hidden text-ellipsis text-nowrap text-2xl font-semibold">
				{title}
			</CardHeader>
			<CardContent>{children}</CardContent>
			<CardFooter>
				<Button className="w-full">去创作</Button>
			</CardFooter>
		</Card>
	)
}
