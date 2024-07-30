import { useRequest } from "ahooks"

import { deleteArticle } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useDeleteArticle = () => {
	return useRequest(deleteArticle, {
		manual: true,
		loadingDelay: 300,
		onSuccess() {
			showSuccessToast("文章已删除")
		},
		onError(error) {
			showErrorToast(`文章删除失败: ${error.message}`)
		},
	})
}
