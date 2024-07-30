import { useRequest } from "ahooks"

import { updateArticle } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useUpdateArticle = () => {
	return useRequest(updateArticle, {
		manual: true,
		loadingDelay: 300,
		onSuccess() {
			showSuccessToast("文章修改成功")
		},
		onError(error) {
			showErrorToast(`文章修改失败：${error.message}`)
		},
	})
}
