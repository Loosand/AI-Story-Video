import { useRequest } from "ahooks"

import { addArticle } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useAddArticle = () => {
	return useRequest(addArticle, {
		manual: true,
		loadingDelay: 300,
		onSuccess() {
			showSuccessToast("文章添加成功")
		},
		onError(error) {
			showErrorToast(`添加文章失败：${error.message}`)
		},
	})
}
