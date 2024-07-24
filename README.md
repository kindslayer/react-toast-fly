# ToastFly

ToastFly is a lightweight and customizable React toast notification library designed to deliver smooth and stylish
notifications in your React applications.

## Features

- **Customizable**: Easily adjust the look and behavior of notifications to match your application's design.
- **Simple API**: A straightforward API for triggering notifications.
- **TypeScript Support**: Built with TypeScript for better development experience and type safety.
- **Flexible**: Support for various toast types and progress indicators.

## Installation

To install ToastFly, use npm or yarn:

```bash
npm install react-toast-fly
# or
yarn add react-toast-fly
```

```typescript jsx
<ToastProvider
	globalOption={{
		turn: true,
		duration: 1000,
		isStacked: true,
		successIcon: SuccessIconComponent,
		warningIcon: WarningIconComponent,
		errorIcon: ErrorIconComponent,
		infoIcon: InfoIconComponent,
		direction: 'rtl' // ltr
	}}
>
	{/*- children -*/}
</ToastProvider>
```

```typescript jsx
    <button
	onClick={() => {
		push({
			title: 'test',
			duration: 1000,
			progress: Progress.Both,
			type: ToastType.SUCCESS,
			content: 'example content',
		})
	}}
>Show</button>
```

```typescript jsx
    const ContentComponent = ()=>{
        return <div><strong>Content</strong></div>
    }
	
    <button
	onClick={() => {
		push({
			title: 'test',
			duration: 1000,
			progress: Progress.Both,
			type: ToastType.SUCCESS,
			content:ContentComponent,
		})
	}}
>Show</button>
```