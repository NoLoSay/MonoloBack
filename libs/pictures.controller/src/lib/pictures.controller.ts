import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    ParseIntPipe,
    Request,
    Response,
    UnauthorizedException,
    Patch,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common'
import { PicturesService } from '@noloback/pictures.service';

@Controller('pictures')
export class PicturesController {
  constructor (private readonly picturesService: PicturesService) {}

//   @Get()
//   async findAll () {}
}
