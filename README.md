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
pnpm add react-toast-fly
# or
npm install react-toast-fly
# or
yarn add react-toast-fly
```
## Usage

To use the react-toast-fly you need to install **tailwind css** first. All the styling are customizable with tailwind css.

## Installation

we created a wrapper component and a toast function. 

1. - **ToastProvider**: It provides a wrapper around all the components and it receives **globalOptions** props that provides the basics for the toast notifications. it provides all the option below.

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

- **turn**: if it sets to true, all the notifications are paused and only the last one will get an interval. when the last one is finished, the next one will get an interval
- **duration**: A straightforward API for triggering notifications.
- **isStacked**: Built with TypeScript for better development experience and type safety.
- **direction**: Support for various toast types and progress indicators.
- **Icons**: Easily adjust the look and behavior of notifications to match your application's design.

2. - **push**: this is a function that generates toast. you can call it on the client side of your react app to generate toast

```typescript jsx
    <button
	onClick={() => {
		push({
			title: 'test',
			duration: 1000,
			progress: Progress.Both,
			type: ToastType.SUCCESS,
			content: 'example content',
			duration:100,
			id:"some id"
		})
	}}
>Show</button>
```

### content and icons can be react components.

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

## Next js Installation

In order to work with next js app router, the ToastProvider needs to be imported in a client component and then the client component needs to be imported in the main layout. also the css needs to be imported as well

As an example

```typescript jsx
'use client'
import React, {ReactNode} from 'react';
import {useRouter} from "next/navigation";
import {ToastProvider} from "react-toast-fly";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

import "react-toast-fly/dist/style.css"

export default function NextUiProvider({children}: { children: ReactNode }) {
	const {push} = useRouter();
	return (
		<ToastProvider
			globalOption={{
				turn: true,
				isStacked: true,
			}}
		>
			<NextUIProvider navigate={push}>
				<NextThemesProvider forcedTheme="dark" attribute="class" defaultTheme="dark">
					{children}
				</NextThemesProvider>
			</NextUIProvider>
		</ToastProvider>
	);
}



 In the Main layout of Next js App router
 
		<html dir="rtl" lang="fa-IR" className={`${dana.variable} font-sans scroll-smooth dark`} style={{colorScheme: 'dark'}}>
		<body>
		<NextUiProvider>
			<Main>
				{children}
			</Main>
		</NextUiProvider>
		</body>
		</html>

```