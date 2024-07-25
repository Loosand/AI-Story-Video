import { useRequest } from "ahooks"

import { deleteWord } from "../actions"

import { showErrorToast, showSuccessToast } from "@/components/ui/toast"

export const useDeleteWord = () => {
	return useRequest(deleteWord, {
		manual: true,
		loadingDelay: 300,
		onSuccess() {
			showSuccessToast("敏感词已删除")
		},
		onError(error) {
			showErrorToast(`敏感词删除失败: ${error.message}`)
		},
	})
}
