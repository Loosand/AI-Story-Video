import Link from "next/link"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ArticleCard({
	id,
	children,
	title,
	onDelete,
}: {
	id: string
	children?: React.ReactNode
	title: string
	onDelete: (id: string) => void
}) {
	return (
		<section className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
			<div className="flex">
				<span className="flex-1 overflow-hidden text-ellipsis text-nowrap text-2xl font-semibold">
					{title}
				</span>
				<AlertDialog>
					<AlertDialogTrigger>
						<Button size="icon" variant="destructive" className="ml-auto">
							<Trash className="size-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>确认删除吗？</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>取消</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									onDelete(id)
								}}>
								确认删除
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<p>{children}</p>
			<footer className="flex gap-2">
				<Button asChild variant="outline">
					<Link href={`/article/edit/${id}`}>去编辑</Link>
				</Button>
				<Button asChild className="flex-1">
					<Link href={`/story/${id}`}>去创作</Link>
				</Button>
			</footer>
		</section>
	)
}
