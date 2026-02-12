export interface HttpExceptionObject {
  name: string
  message: string
}

export function buildHttpExceptionObject(
  name: string,
  message: string,
): HttpExceptionObject {
  return {
    name: name,
    message: message,
  }
}
