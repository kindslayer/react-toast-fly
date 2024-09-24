import App from '@/App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import ToastProvider from "@/Toast/ToastProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ToastProvider
			globalOption={{
				turn: true,
				isStacked: false,
				direction: 'rtl',
				duration: 5000,
			}}
		>
			<App />
		</ToastProvider>
	</React.StrictMode>,
)
