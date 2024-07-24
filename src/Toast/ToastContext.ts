import InfoIcon from "../../public/pending.svg"
import ErrorIcon from "../../public/failed.svg"
import SuccessIcon from "../../public/success.svg"
import {createContext, useContext} from "react";
import {GlobalContextOptionType, GlobalToastOptions} from "@/Toast/types";

export const defaultToastOptions: GlobalToastOptions = {
	turn: true,
	duration: 6000,
	direction: 'rtl',
	isStacked: true,
	infoIcon: InfoIcon,
	errorIcon: ErrorIcon,
	successIcon: SuccessIcon,
	warningIcon: SuccessIcon,
	position: 'bottom-right',
}

const ToastContext = createContext<GlobalContextOptionType>({
	items: {},
	...defaultToastOptions,
	pushToast() {
		return;
	},
	deleteToast() {
		return;
	},
	updateToast() {
		return;
	},
});

export function _useToastContext(): GlobalContextOptionType {
	return useContext(ToastContext);
}

export default ToastContext;
