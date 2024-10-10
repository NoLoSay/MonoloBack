import { PrismaBaseService, SignLanguage } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import {
  SignLanguageAdminReturn,
  SignLanguageCommonReturn
} from '@noloback/api.returns'
import {
  SignLanguageAdminSelect,
  SignLanguageCommonSelect
} from '@noloback/db.calls'

@Injectable()
export class SignLanguagesService {
  constructor (private prismaBase: PrismaBaseService) {}

  async getSignLanguages (): Promise<SignLanguageCommonReturn[]> {
    return this.prismaBase.signLanguage.findMany({
      select: new SignLanguageCommonSelect(),
      where: { deletedAt: null }
    })
  }

  async getAdminSignLanguages (): Promise<SignLanguageAdminReturn[]> {
    return this.prismaBase.signLanguage.findMany({
      select: new SignLanguageAdminSelect()
    })
  }

  async create (body: any): Promise<SignLanguageAdminReturn> {
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      const foundCode: {id: number, code: string} | null = await this.prismaBase.signLanguage.findFirst({
        where: { code: body.code },
        select:  {id: true, code: true}
      })

      const foundName: {id: number, name: string} | null = await this.prismaBase.signLanguage.findFirst({
        where: { name: body.name },
        select:   {id: true, name: true}
      })

      if (foundCode && foundName && foundCode.id === foundName.id) {
        return this.prismaBase.signLanguage.update({
          where: { id: +foundCode.id },
          data: { ...body, deletedAt: null },
          select: new SignLanguageAdminSelect()
        })
      } else if (foundCode) {
        throw new BadRequestException('Code already used.')
      } else if (foundName) {
        throw new BadRequestException('Name already used.')
      }

      return await this.prismaBase.signLanguage.create({
        data: body,
        select: new SignLanguageAdminSelect()
      })
    } catch (error){
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException('Internal error. Please try again later.')
    }
  }

  async patch (uuid: string, body: any): Promise<SignLanguageAdminReturn> {
    if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    if (body.createdAt || body.updatedAt || body.deletedAt) {
      throw new BadRequestException('Cannot update timestamps')
    }
    try {
      return await this.prismaBase.signLanguage.update({
        where: { uuid },
        data: body,
        select: new SignLanguageAdminSelect()
      })
    } catch {
      throw new NotFoundException('Sign Language not found')
    }
  }

  async delete (uuid: string): Promise<SignLanguageAdminReturn> {
    try {
      return await this.prismaBase.signLanguage.update({
        where: { uuid },
        data: { deletedAt: new Date() },
        select: new SignLanguageAdminSelect()
      })
    } catch {
      throw new NotFoundException('Sign Language not found')
    }
  }
}
