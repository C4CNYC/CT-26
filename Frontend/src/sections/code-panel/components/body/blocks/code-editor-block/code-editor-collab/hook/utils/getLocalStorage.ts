import { StudentFile } from '@root/src/redux/services/interfaces/workspace.interface'

export const getLocalStorageRoomKey = (roomId: string | undefined): string => `room_doc_${roomId}`

export function getLocalStorageCode(key: string) {
  const localStorageCodeValue = localStorage.getItem(key)
  if (!localStorageCodeValue) return null

  try {
    const docInfo = JSON.parse(localStorageCodeValue) as Record<string, any>

    if (docInfo?.htmlBody !== undefined) {
      return (docInfo.htmlBody as unknown as string[])?.join('') ?? docInfo.htmlBody
    }

    if (docInfo?.default?.body !== undefined) {
      return docInfo.default.body
    }

    const values = Object.values(docInfo)
    if (values.length > 0 && typeof values[0]?.body === 'string') {
      const allBodies = values
        .filter((v: any) => typeof v?.body === 'string')
        .map((v: any) => v.body)
        .join('\n')
      return allBodies || null
    }

    return localStorageCodeValue
  } catch (e) {
    return localStorageCodeValue
  }
}

export function getLocalStorageFile(
  key: string,
  fileName: string = 'default'
): StudentFile | undefined {
  const localStorageCodeValue = localStorage.getItem(key)
  if (!localStorageCodeValue) return undefined

  try {
    const docInfo = JSON.parse(localStorageCodeValue) as Record<string, StudentFile>
    return docInfo?.[fileName] as StudentFile
  } catch (e) {
    return undefined
  }
}

export function killLocalStorageFile(key: string, fileName: string = 'default'): void {
  const localStorageCodeValue = localStorage.getItem(key)
  if (!localStorageCodeValue) return

  try {
    const docInfo = JSON.parse(localStorageCodeValue) as Record<string, StudentFile>
    if (docInfo?.[fileName]) {
      delete docInfo[fileName]
      localStorage.setItem(key, JSON.stringify(docInfo))
    }
  } catch (e) {
    return
  }
}
