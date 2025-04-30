/**
 * Utility function to safely stringify objects for debugging
 */
export function safeStringify(obj: unknown, space = 2): string {
  try {
    return JSON.stringify(
      obj,
      (key, value) => {
        // Handle circular references
        if (typeof value === "object" && value !== null) {
          if (Object.keys(value).length > 100) {
            return `[Large Object with ${Object.keys(value).length} keys]`
          }
        }
        // Handle functions
        if (typeof value === "function") {
          return `[Function: ${value.name || "anonymous"}]`
        }
        return value
      },
      space,
    )
  } catch (error) {
    return `[Error stringifying object: ${String(error)}]`
  }
}

/**
 * Debug helper to safely access and log nested properties
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const parts = path.split(".")
    let current = obj

    for (const part of parts) {
      if (current === null || current === undefined) {
        return defaultValue
      }
      current = current[part]
    }

    return current === undefined ? defaultValue : (current as T)
  } catch (error) {
    console.warn(`Error accessing path "${path}":`, error)
    return defaultValue
  }
}

/**
 * Helper to provide more informative logs during build and runtime
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV !== "production") {
    console.group(`[DEBUG] ${message}`)
    if (data !== undefined) {
      console.log(safeStringify(data))
    }
    console.groupEnd()
  }
}

/**
 * Timed execution helper for performance debugging
 */
export async function timeExecution<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now()
  try {
    const result = await fn()
    const endTime = performance.now()
    debugLog(`⏱️ ${name} took ${(endTime - startTime).toFixed(2)}ms`)
    return result
  } catch (error) {
    const endTime = performance.now()
    debugLog(`⏱️ ${name} failed after ${(endTime - startTime).toFixed(2)}ms`, { error })
    throw error
  }
}
