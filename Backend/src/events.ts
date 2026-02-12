import { EventMap } from 'eventemitter2'

export const eventModuleConfig = {
  wildcard: false,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: true,
  ignoreErrors: false,
}

export enum CodeEvent {
  PERMISSION_CHANGE = 'code.permission_change' /** codeId: The id of the [@link Code], which permissions are changed. **/,
  DELETION = 'code.deletion' /** codeId: The id of the [@link Code], which is being deleted. **/,
}

export interface CodeEventMap extends EventMap {
  [CodeEvent.PERMISSION_CHANGE]: (codeId: string) => void
}
