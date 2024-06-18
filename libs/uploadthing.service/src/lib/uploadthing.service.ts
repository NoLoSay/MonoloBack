import { Injectable } from "@nestjs/common";
import { UTApi } from "uploadthing/server";

@Injectable()
export class UploadthingService {
  private utapi: UTApi = new UTApi()

  async uploadFile(file: any) {
    const { buffer, originalname } = file;
    const blob = new Blob([buffer]);
    const uploadFile = new File([blob], originalname);
    const uploadedFile = await this.utapi.uploadFiles(uploadFile);
    return uploadedFile.data?.url
  }
}
