import { Injectable } from "@nestjs/common";
import path = require("path");
import { UTApi } from "uploadthing/server";
import { FileEsque } from "uploadthing/types";

@Injectable()
export class UploadthingService {
  private utapi: UTApi = new UTApi()

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const { buffer, originalname } = file;

      // Create a FileEsque object
      const uploadFile: FileEsque = {
        ...new Blob([buffer], { type: file.mimetype }),
        name: originalname,
      };

      // Upload the file using the utapi.uploadFiles method
      const response = await this.utapi.uploadFiles([uploadFile]);

      if (response && response[0] && response[0].data) {
        return response[0].data.url;
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // async uploadFile(file: any) {
  //   try {
  //     const { buffer, originalname } = file;
  //     const blob = new Blob([buffer]);
  //     const uploadFile: FileEsque = {
  //       ...blob,
  //       name: originalname,
  //     };
  //     console.log('Uploading file:', uploadFile);
  //     const response = await this.utapi.uploadFiles(uploadFile);
  //     console.log('Upload response:', response);
  //     return response.data?.url;
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw error;
  //   }
  // }
}
