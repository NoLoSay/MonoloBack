import { ConsoleLogger, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { LoggerService } from "@noloback/logger-lib";
import {
  Picture,
  PrismaBaseService,
} from '@noloback/prisma-client-base'
import { UploadthingService } from "@noloback/uploadthing.service";
import { readFileSync, unlink } from 'fs';
import path = require("path");

@Injectable()
export class PicturesService {
  constructor(
    private readonly prismaBase: PrismaBaseService,
    private readonly uploadthingService: UploadthingService
  ) {}

  async createPicture(picturePath: string): Promise<Picture> {
    try {
      const picture = (await this.prismaBase.picture.create({
        data: {
          localPath: picturePath,
          hostingUrl: ``
        }
      }))

      let updatedPicture = await this.prismaBase.picture.update({
        where: {
          uuid: picture.uuid
        },
        data: {
          hostingUrl: `${process.env["VIDEO_API_URL"]}/pictures/${picture.uuid}`
        }
      });

      const uploadThingPictureUrl = await this.uploadthingService.uploadFromUrl(updatedPicture.hostingUrl, path.extname(updatedPicture.localPath ? updatedPicture.localPath : 'default.png'));
      if (uploadThingPictureUrl) {
        if (updatedPicture.localPath) {
          unlink(updatedPicture.localPath, (err) => {
            if (err) {
              console.log(err)
              // LoggerService.log('High', 'PicturesService.createPicture', undefined, JSON.stringify(err))
            }
          });
        }

        updatedPicture = await this.prismaBase.picture.update({
          where: {
            uuid: picture.uuid
          },
          data: {
            localPath: null,
            hostingUrl: uploadThingPictureUrl
          }
        });
      }

      return updatedPicture;
    } catch (error: any) {
      console.error(error)
      // LoggerService.log('Critical', 'PicturesService.createPicture', error, `Error creating picture: ${error.message}`)
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
