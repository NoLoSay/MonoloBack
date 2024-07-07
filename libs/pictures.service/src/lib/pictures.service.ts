import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {
  Picture,
  PrismaBaseService,
} from '@noloback/prisma-client-base'
import { readFileSync } from 'fs';

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
          hostingUrl: ``
        }
      }))

      const updatedPicture = await this.prismaBase.picture.update({
        where: {
          uuid: picture.uuid
        },
        data: {
          hostingUrl: `${process.env["API_URL"]}:${process.env["VIDEO_API_PORT"]}/pictures/${picture.uuid}`
        }
      });

      return updatedPicture;
    } catch (error: any) {
      console.error(`Error creating picture: ${error.message}`);
      throw new InternalServerErrorException(`Error creating picture`);
    }
  }

  async getPicture(uuid: string) {
    const picture = await this.prismaBase.picture.findUnique({
      where: {
        uuid: uuid
      }
    });
    
    if (!picture) {
      throw new NotFoundException(`Picture with UUID ${uuid} not found`);
    }

    const fileContent = readFileSync(picture.localPath);
    return fileContent;
  }

  async getPictureDetails(uuid: string): Promise<Picture> {
    const picture = await this.prismaBase.picture.findUnique({
      where: {
        uuid: uuid
      }
    });
  
    if (!picture) {
      throw new NotFoundException(`Picture with UUID ${uuid} not found`);
    }
  
    return picture;
  }
}
