import { PrismaBaseService, SignLanguage } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'

@Injectable()
export class SignLanguagesService {
  constructor (private prismaBase: PrismaBaseService) {}

  async getSignLanguages (): Promise<
    { id: number; name: string; code: string; color: string }[]
  > {
    return this.prismaBase.signLanguage.findMany({
      select: { id: true, name: true, code: true, color: true },
      where: { deletedAt: null }
    })
  }

  async getAdminSignLanguages (): Promise<SignLanguage[]> {
    return this.prismaBase.signLanguage.findMany({})
  }

  async create (body: any): Promise<SignLanguage> {
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.signLanguage.create({ data: body })
    } catch {
      throw new BadRequestException('Sign Language not created')
    }
  }

  async patch (id: number, body: any): Promise<SignLanguage> {
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    if (body.createdAt || body.updatedAt || body.deletedAt) {
      throw new BadRequestException('Cannot update timestamps')
    }
    try {
      return await this.prismaBase.signLanguage.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Sign Language not found')
    }
  }

  async delete (id: number): Promise<SignLanguage> {
    try {
      return await this.prismaBase.signLanguage.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
    } catch {
      throw new NotFoundException('Sign Language not found')
    }
  }
}
