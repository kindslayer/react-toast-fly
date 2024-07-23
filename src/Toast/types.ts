import {ComponentType} from "react";
import {Progress, ToastType} from "@/Toast/index";

export type GlobalToastOptions = {
	position: 'top' | 'left' | 'right' | 'bottom' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left',
	direction: 'rtl' | 'ltr',
	turn: boolean,
	isStacked: boolean,
	duration: number,
	infoIcon: ComponentType | string
	errorIcon: ComponentType | string
	successIcon: ComponentType | string
	warningIcon: ComponentType | string
}

export type PartialToastOptions = Partial<GlobalToastOptions>;

export type ToastItemType = {
	id: string,
	title: string,
	type: ToastType,
	duration: number,
	progress: Progress
	content: undefined | string | ComponentType,
};

export type GlobalContextOptionType = {
	items: Record<string, ToastItemType>,
	pushToast: PushToastFunction,
	deleteToast: DeleteToastFunction,
	updateToast: UpdateToastFunction,
} & GlobalToastOptions

export type UseToastType = {
	push: PushToastFunction,
}

export type PushToastFunction = (
	options: Partial<ToastItemType> & { title: string }
) => void;

export type DeleteToastFunction = (
	id: string
) => void;

export type UpdateToastFunction = (
	_toast: ToastItemType
) => void;