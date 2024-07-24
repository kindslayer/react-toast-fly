import {cn} from "@/utils";
import {ToastItemType} from "@/Toast/types";
import {Progress, ToastType} from "@/Toast/index";
import {_useToastContext} from "@/Toast/ToastContext";
import ToastCloseButton from "@/Toast/ToastCloseButton";
import {ReactElement, ReactNode, useEffect, useMemo, useRef, useState} from "react";

const Toast = ({item}: { item: ToastItemType }) => {
	const contextOption = _useToastContext();
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [isHover, setHover] = useState<boolean>(false);

	const ToastIcon = (): ReactElement => {
		const Icon = contextOption[`${item.type}Icon`];

		if (typeof Icon === "string") {
			return <img draggable={false} src={Icon} alt={'success'} />;
		} else {
			return <Icon />;
		}
	};

	const ToastContent = (): ReactNode => {
		if (!item.content) return undefined;

		if (typeof item.content === "string") {
			return <div className={'toast--content'}>{item.content}</div>;
		} else {
			const Content = item.content;
			return <Content />;
		}
	};

	const progressPercentage = useMemo(
		() => Math.max(0, (item.duration / (contextOption.duration || item.duration)) * 100),
		[item.duration, contextOption.duration]
	);

	const toastTypeToColorClass = {
		[ToastType.SUCCESS]: 'bg-emerald-400',
		[ToastType.INFO]: 'bg-blue-400',
		[ToastType.WARNING]: 'bg-yellow-400',
		[ToastType.ERROR]: 'bg-rose-400',
	};

	useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			if (!isHover) {
				const currentItem = contextOption.items[item.id];

				if (currentItem.duration <= -100) {
					clearInterval(intervalRef.current!);
					contextOption.deleteToast(item.id);
				} else {
					contextOption.updateToast({
						...currentItem,
						duration: currentItem.duration - 100
					});
				}
			}
		}, 100);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [contextOption, item.id, isHover]);

	useEffect(() => {
		const itemKeys = Object.keys(contextOption.items);
		const relevantItemKey = contextOption.isStacked ? itemKeys[0] : itemKeys[itemKeys.length - 1];

		if (relevantItemKey && contextOption.isStacked || (!contextOption.isStacked && contextOption.turn)) {
			if (relevantItemKey !== item.id) {
				intervalRef.current && clearInterval(intervalRef.current);
			}
		}
	}, [contextOption.items, item.id, contextOption.isStacked]);


	return (
		<div
			className={cn(
				'toast text-slate-900 select-none pointer-events-auto group-hover/stacked:opacity-100 group-hover/stacked:scale-100 group-hover/stacked:translate-y-0',
				item.progress === Progress.Circular && 'border-b-2 border-slate-300'
			)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className="toast--body">
				<div className="toast--icon shrink-0">
					<ToastIcon />
				</div>

				<div className="toast--title pt-1 px-3 text-start grow">{item.title}</div>

				<div className="toast--close shrink-0">
					<ToastCloseButton item={item} />
				</div>
			</div>

			<ToastContent />

			{[Progress.Linear, Progress.Both].includes(item.progress) &&
				(<div className="toast--progress" role="progressbar">
					<div
						className={cn(
							'toast--progress--bar',
							toastTypeToColorClass[item.type],
						)}
						style={{width: `${progressPercentage <= 0 ? 0 : progressPercentage}%`}}
					></div>
				</div>)
			}
		</div>
	);
};

export default Toast;
