"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function ArticlePage() {
	return (
		<section>
			<div className="grid w-full gap-6 md:px-20">
				<Textarea placeholder="输入你的文章" className="min-h-96" />
				<Link href="/article/edit" className={cn(buttonVariants())}>
					去清洗敏感词
				</Link>
			</div>
		</section>
	)
}
