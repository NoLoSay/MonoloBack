import { Injectable } from "@nestjs/common";
import { LoggerService } from "@noloback/logger-lib";
import path = require("path");
import { UTApi } from "uploadthing/server";
import { FileEsque } from "uploadthing/types";

@Injectable()
export class UploadthingService {
  private utapi: UTApi = new UTApi()

  async uploadFromUrl(url: string, extname: string): Promise<string | undefined> {
    const uploadedFile = await this.utapi.uploadFilesFromUrl(url + extname);

    return uploadedFile.data?.url
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const { buffer, originalname } = file;

      const uploadFile: FileEsque = {
        ...new Blob([buffer], { type: file.mimetype }),
        name: originalname,
      };

      const response = await this.utapi.uploadFiles([uploadFile]);

      if (response && response[0] && response[0].data) {
        return response[0].data.url;
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error: any) {
      console.error(error)
      // LoggerService.log('Critical', 'PicturesService.createPicture', error, `Error uploading file: ${error.message}`)
      throw error;
    }
  }
}
