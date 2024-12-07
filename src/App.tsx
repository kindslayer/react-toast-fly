import {Progress, ToastType, useToast} from "@/Toast";
import "/src/Toast/index.css"

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