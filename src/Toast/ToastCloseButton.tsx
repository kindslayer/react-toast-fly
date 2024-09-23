import { cn } from "@/utils";
import { useContext, useRef, useEffect, useCallback } from "react";
import { ToastItemType } from "@/Toast/types";
import ToastContext from "@/Toast/ToastContext";
import { Progress, ToastType } from "@/Toast/index";

const ToastCloseButton = ({ item, isHover, elapsedTime }: { item: ToastItemType; isHover: boolean; elapsedTime: number }) => {
	const contextOption = useContext(ToastContext);
	const hasProgress = [Progress.Circular, Progress.Both].includes(item.progress);

	const circleRef = useRef<SVGCircleElement>(null);
	const lastUpdateTimeRef = useRef<number>(performance.now());
	const animationFrameRef = useRef<number | null>(null);

	const toastTypeToColorClass = {
		[ToastType.SUCCESS]: 'text-emerald-400',
		[ToastType.INFO]: 'text-blue-400',
		[ToastType.WARNING]: 'text-yellow-400',
		[ToastType.ERROR]: 'text-rose-400',
	};

	const updateProgress = useCallback(() => {
		if (!isHover) {
			const currentTime = performance.now();
			const deltaTime = currentTime - lastUpdateTimeRef.current;
			lastUpdateTimeRef.current = currentTime;

			const totalElapsedTime = elapsedTime + deltaTime;

			if (totalElapsedTime >= item.duration) {
				contextOption.deleteToast(item.id);
			} else {
				const percentage = Math.min(100, (totalElapsedTime / item.duration) * 100);

				if (circleRef.current) {
					circleRef.current.style.strokeDashoffset = `${100 - percentage}`;
				}

				animationFrameRef.current = requestAnimationFrame(updateProgress);
			}
		} else {
			lastUpdateTimeRef.current = performance.now(); // Reset last update time when hovering
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}
	}, [contextOption, item.id, item.duration, isHover, elapsedTime]);

	useEffect(() => {
		if (hasProgress) {
			animationFrameRef.current = requestAnimationFrame(updateProgress);
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [hasProgress, updateProgress]);

	return (
		<button
			type="button"
			onClick={() => contextOption.deleteToast(item.id)}
			className="bg-slate-100 hover:bg-slate-200 rounded-full"
		>
			<svg className="size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
				{hasProgress && (
					<circle
						r="16"
						cx="18"
						cy="18"
						fill="none"
						strokeWidth="3"
						className="stroke-current text-slate-200 transition"
					/>
				)}

				<g className="origin-center -rotate-90 transform">
					<path
						className="translate-y-1.5 translate-x-1.5 stroke-slate-600"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
					/>
					{hasProgress && (
						<circle
							ref={circleRef}
							cx="18"
							cy="18"
							r="16"
							fill="none"
							strokeWidth="3"
							strokeDasharray="100"
							strokeLinecap="round"
							strokeDashoffset="0"
							className={cn(
								"stroke-current circle-progress transition-all duration-75",
								toastTypeToColorClass[item.type],
							)}
						/>
					)}
				</g>
			</svg>
		</button>
	);
};

export default ToastCloseButton;