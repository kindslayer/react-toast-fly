import { cn } from "@/utils";
import { ToastItemType } from "@/Toast/types";
import { Progress, ToastType } from "@/Toast/index";
import { _useToastContext } from "@/Toast/ToastContext";
import ToastCloseButton from "@/Toast/ToastCloseButton";
import { ReactElement, ReactNode, useEffect, useRef, useState, useCallback } from "react";

const Toast = ({ item }: { item: ToastItemType }) => {
	const contextOption = _useToastContext();
	const [isHover, setHover] = useState<boolean>(false);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const { animationFrameRef, elapsedTimeRef, activeStartTimeRef, lastUpdateTimeRef } = useRefs();

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
		if (isHover) {
			lastUpdateTimeRef.current = performance.now();
			return;
		}

		const currentTime = performance.now();
		lastUpdateTimeRef.current = currentTime;

		const relevantItemKey = getRelevantItemKey(contextOption);
		if (relevantItemKey === item.id) {
			handleActiveToast(currentTime);
		} else {
			cancelAnimationFrame(animationFrameRef.current!);
			activeStartTimeRef.current = null;
		}
	}, [contextOption, item.id, item.duration, isHover]);

	const handleActiveToast = (currentTime: number) => {
		if (activeStartTimeRef.current === null) {
			activeStartTimeRef.current = currentTime;
		}

		const activeElapsedTime = currentTime - activeStartTimeRef.current;
		const totalElapsedTime = elapsedTimeRef.current + activeElapsedTime;

		if (totalElapsedTime >= item.duration) {
			contextOption.deleteToast(item.id);
		} else {
			updateProgressBar(totalElapsedTime, item.duration);
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	};

	const updateProgressBar = (elapsed: number, duration: number) => {
		const progressPercentage = Math.min(100, (elapsed / duration) * 100);
		if (progressBarRef.current) {
			progressBarRef.current.style.width = `${100 - progressPercentage}%`;
		}
	};

	const getRelevantItemKey = (contextOption: any) => {
		const itemKeys = Object.keys(contextOption.items);
		return contextOption.isStacked ? itemKeys[0] : itemKeys[itemKeys.length - 1];
	};

	useEffect(() => {
		animationFrameRef.current = requestAnimationFrame(updateProgress);
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [updateProgress]);

	useEffect(() => {
		const relevantItemKey = getRelevantItemKey(contextOption);
		if (relevantItemKey === item.id) {
			resumeTimer();
		} else {
			pauseTimer();
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [contextOption.items, item.id, contextOption.isStacked, updateProgress, isHover]);

	const resumeTimer = () => {
		if (!animationFrameRef.current && !isHover) {
			lastUpdateTimeRef.current = performance.now();
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	};

	const pauseTimer = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
			if (activeStartTimeRef.current !== null) {
				elapsedTimeRef.current += performance.now() - activeStartTimeRef.current;
				activeStartTimeRef.current = null;
			}
		}
	};

	const handleMouseEnter = () => {
		setHover(true);
		pauseTimer();
	};

	const handleMouseLeave = () => {
		setHover(false);
		resumeTimer();
	};

	return (
		<div
			className={cn(
				'toast text-slate-900 select-none pointer-events-auto group-hover/stacked:opacity-100 group-hover/stacked:scale-100 group-hover/stacked:translate-y-0',
				item.progress === Progress.Circular && 'border-b-2 border-slate-300'
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="toast--body">
				<div className="toast--icon shrink-0">
					<ToastIcon />
				</div>

				<div className="toast--title pt-1 px-3 text-start grow">{item.title}</div>

				<div className="toast--close shrink-0">
					<ToastCloseButton activeStartTime={activeStartTimeRef.current} elapsedTimeRef={elapsedTimeRef.current} item={item} isHover={isHover}/>
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

const useRefs = () => {
	const animationFrameRef = useRef<number | null>(null);
	const elapsedTimeRef = useRef<number>(0);
	const activeStartTimeRef = useRef<number | null>(null);
	const lastUpdateTimeRef = useRef<number>(performance.now());
	return { animationFrameRef, elapsedTimeRef, activeStartTimeRef, lastUpdateTimeRef };
};

export default Toast;