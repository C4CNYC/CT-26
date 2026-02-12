export class MessageDto {
  readonly message: string

  constructor(message = '') {
    this.message = message
  }
}
