'use client'

import {ReactNode, useState} from "react";
import {Progress, ToastType} from "@/Toast/index";
import ToastContainer from "@/Toast/ToastContainer";
import ToastContext, {defaultToastOptions} from "@/Toast/ToastContext";
import {DeleteToastFunction, GlobalContextOptionType, PartialToastOptions, PushToastFunction, ToastItemType, UpdateToastFunction} from "@/Toast/types";

const ToastProvider = ({globalOption = {}, children}: {
	globalOption?: PartialToastOptions,
	children: ReactNode
}) => {
	const _duration = globalOption.duration || defaultToastOptions.duration
	const [items, setItems] = useState<GlobalContextOptionType['items']>({});

	const pushToast: PushToastFunction = (option) => {
		const _item: ToastItemType = {
			id: Math.random().toString(36).substring(2, 14),
			title: option.title,
			type: option.type || ToastType.INFO,
			duration: _duration,
			content: option.content,
			progress: option.progress || Progress.NONE,
		};

		setItems(prevState => {
			const newState = {[_item['id']]: _item, ...prevState};

			if (globalOption.isStacked) {
				delete newState[_item['id']];
				return {[_item['id']]: _item, ...newState};
			}

			return newState;
		});
	}

	const deleteToast: DeleteToastFunction = (id: string) => {
		setItems((prevState) => {
			const newState = {...prevState};
			delete newState[id];
			return newState;
		});
	};

	const updateToast: UpdateToastFunction = (_item: ToastItemType) => {
		setItems((prevState) => ({
			...prevState,
			[_item.id]: _item,
		}));
	}

	const _options: GlobalContextOptionType = {
		...defaultToastOptions,
		...globalOption,
		items,
		pushToast,
		deleteToast,
		updateToast
	}

	return (
		<ToastContext.Provider value={_options}>
			{children}
			<ToastContainer options={_options} />
		</ToastContext.Provider>
	);
};

export default ToastProvider;
