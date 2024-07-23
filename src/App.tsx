import {Progress, ToastType, useToast} from "@/Toast";

function App() {
	const {push} = useToast()
	return (
		<button
			type={'button'}
			onClick={() => push({
				title: 'test',
				type: ToastType.SUCCESS,
				progress: Progress.Both,
			})}
		> Add Toast
		</button>
	)

}

export default App;