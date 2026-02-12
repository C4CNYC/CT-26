import {
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common'

@Injectable()
export class ParseImagePipe extends ParseFilePipe {
  constructor(max_size: number) {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: max_size }),
        new FileTypeValidator({
          fileType: new RegExp(/[./](gif|jpg|jpeg|tiff|png|webp)$/i),
        }),
      ],
    })
  }
}
