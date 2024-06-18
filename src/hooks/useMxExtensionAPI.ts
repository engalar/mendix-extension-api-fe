import { useEffect } from 'react'

interface CustomWindow extends Window {
  chrome?: {
    webview?: Window
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PostMessage = (message: string, data?: any) => void

declare const window: CustomWindow
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMxExtensionAPI(handlers: any): [PostMessage] {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { message, data } = event.data
      handlers[message]?.(data)
    }

    window.chrome?.webview?.addEventListener('message', handleMessage)
    window.chrome?.webview?.postMessage({
      message: 'MessageListenerRegistered'
    })
    window.chrome?.webview?.postMessage({ message: 'ListPage_Req' })

    return () => {
      window.chrome?.webview?.removeEventListener('message', handleMessage)
    }
  }, [handlers])

  const postMessage: PostMessage = (message, data) => {
    window.chrome?.webview?.postMessage({ message, data })
  }

  return [postMessage]
}
