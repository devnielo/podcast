export interface ErrorContext {
  component?: string
  action?: string
  endpoint?: string
  [key: string]: unknown
}

export const logError = (error: unknown, context?: ErrorContext): void => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined
  
  const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}=${v}`).join(', ')}]` : ''
  
  console.error(`Error${contextStr}: ${errorMessage}`)
  
  if (errorStack) {
    console.error('Stack trace:', errorStack)
  }
}

export const handleApiError = (error: unknown, context?: ErrorContext): void => {
  logError(error, { ...context, type: 'API_ERROR' })
}

export const handleComponentError = (error: unknown, componentName: string): void => {
  logError(error, { component: componentName, type: 'COMPONENT_ERROR' })
}
