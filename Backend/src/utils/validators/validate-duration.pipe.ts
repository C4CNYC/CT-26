import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

const regex =
  /^(?!.*(second|minute|hour|day|week|month|year).*\1)\d+\s?(?:second|minute|hour|day|week|month|year)s?(?: ?\d+\s?(?:second|minute|hour|day|week|month|year)s?)*$/gm

type Value = { duration?: string }

@Injectable()
export class ValidateDurationPipe implements PipeTransform<Value> {
  transform(value: Value): Value {
    const { duration } = value
    if (!duration) return value
    if (duration.match(regex)) {
      return value
    } else {
      throw new BadRequestException(`Duration field must be an interval type. Check the following regex:
      ${regex}`)
    }
  }
}
