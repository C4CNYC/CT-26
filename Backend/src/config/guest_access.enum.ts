export enum GuestAccess {
  DENY = 'deny',
  READ = 'read',
  WRITE = 'write',
  CREATE = 'create',
}

export function getGuestAccessOrdinal(guestAccess: GuestAccess): number {
  switch (guestAccess) {
    case GuestAccess.DENY:
      return 0
    case GuestAccess.READ:
      return 1
    case GuestAccess.WRITE:
      return 2
    case GuestAccess.CREATE:
      return 3
    default:
      throw Error('Unknown permission')
  }
}
