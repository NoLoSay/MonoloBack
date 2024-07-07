import { Injectable, InternalServerErrorException } from "@nestjs/common";
import {
  Picture,
  PrismaBaseService,
} from '@noloback/prisma-client-base'
import { randomUUID } from "crypto";

@Injectable()
export class PicturesService {
  constructor(
    private readonly prismaBase: PrismaBaseService
  ) {}

  async createPicture(picturePath: string): Promise<Picture> {
    try {
      const picture = (await this.prismaBase.picture.create({
        data: {
          localPath: picturePath,
          hostingUrl: `${process.env["API_URL"]}:${process.env["VIDEO_API_PORT"]}/pictures/${randomUUID()}`
        }
      }))
      return picture;
    } catch (error: any) {
      console.error(`Error creating picture: ${error.message}`);
      throw new InternalServerErrorException(`Error creating picture`);
    }
  }
}
