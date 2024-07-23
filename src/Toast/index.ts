import {useContext} from "react";
import {UseToastType} from "@/Toast/types";
import ToastContext from "@/Toast/ToastContext";
import ToastProvider from "@/Toast/ToastProvider";

enum ToastType {
	INFO = 'info',
	ERROR = 'error',
	SUCCESS = 'success',
	WARNING = 'warning',
}

enum Progress {
	NONE = 'none',
	Both = 'both',
	Circular = 'circular',
	Linear = 'linear',
}

function useToast(): UseToastType {
	const {pushToast} = useContext(ToastContext);

	return {
		push: pushToast,
	}
}

export {
	useToast,
	ToastType,
	Progress,
	ToastProvider
}