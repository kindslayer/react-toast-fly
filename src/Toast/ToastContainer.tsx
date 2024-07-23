import {cn} from "@/utils";
import Toast from "@/Toast/Toast";
import {GlobalContextOptionType, ToastItemType} from "@/Toast/types";

const ToastContainer = ({options}: { options: GlobalContextOptionType }) => {
	return (
		<div
			dir={options.direction}
			className={cn(options.isStacked && 'toast-container-stacked group/stacked', 'toast-container gap-2')}
		>
			{
				options.items && Object.values(options.items).map((item: ToastItemType) => item && (
					<Toast key={item.id} item={item} />)
				)
			}
		</div>
	);
};

export default ToastContainer;