import { cn } from "@/utils";
import { ToastItemType } from "@/Toast/types";
import { Progress, ToastType } from "@/Toast/index";
import { _useToastContext } from "@/Toast/ToastContext";
import ToastCloseButton from "@/Toast/ToastCloseButton";
import { ReactElement, ReactNode, useEffect, useRef, useState, useCallback } from "react";

const Toast = ({ item }: { item: ToastItemType }) => {
	const contextOption = _useToastContext();
	const [isHover, setHover] = useState<boolean>(false);
	// const remainingDurationRef = useRef<number>(item.duration);
	const elapsedTimeRef = useRef<number>(0);
	const lastUpdateTimeRef = useRef<number>(performance.now());
	const animationFrameRef = useRef<number | null>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	console.log(isHover)

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

	const toastTypeToColorClass = {
		[ToastType.SUCCESS]: 'bg-emerald-400',
		[ToastType.INFO]: 'bg-blue-400',
		[ToastType.WARNING]: 'bg-yellow-400',
		[ToastType.ERROR]: 'bg-rose-400',
	};

	const updateProgress = useCallback(() => {
		if (!isHover) {
			const currentTime = performance.now();
			const deltaTime = currentTime - lastUpdateTimeRef.current;
			lastUpdateTimeRef.current = currentTime;

			elapsedTimeRef.current += deltaTime;

			if (elapsedTimeRef.current >= item.duration) {
				contextOption.deleteToast(item.id);
			} else {
				const progressPercentage = Math.min(100, (elapsedTimeRef.current / item.duration) * 100);

				if (progressBarRef.current) {
					progressBarRef.current.style.width = `${100 - progressPercentage}%`;
				}

				animationFrameRef.current = requestAnimationFrame(updateProgress);
			}
		} else {
			lastUpdateTimeRef.current = performance.now(); // Reset last update time when hovering
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	}, [contextOption, item.id, item.duration, isHover]);

	useEffect(() => {
		animationFrameRef.current = requestAnimationFrame(updateProgress);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [updateProgress]);

	useEffect(() => {
		const itemKeys = Object.keys(contextOption.items);
		const relevantItemKey = contextOption.isStacked ? itemKeys[0] : itemKeys[itemKeys.length - 1];

		if ((contextOption.isStacked || (!contextOption.isStacked && contextOption.turn)) && relevantItemKey !== item.id) {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		}
	}, [contextOption.items, item.id, contextOption.isStacked, contextOption.turn]);

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
					<ToastCloseButton elapsedTime={elapsedTimeRef.current} item={item} isHover={isHover}/>
				</div>
			</div>

			<ToastContent />

			{[Progress.Linear, Progress.Both].includes(item.progress) && (
				<div className="toast--progress" role="progressbar">
					<div
						ref={progressBarRef}
						className={cn(
							'toast--progress--bar',
							toastTypeToColorClass[item.type],
						)}
						style={{ width: '100%' }}
					></div>
				</div>
			)}
		</div>
	);
};

export default Toast;