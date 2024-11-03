import {
  PrismaClient,
  Role,
  ValidationStatus,
  PersonType,
  SiteType,
  SiteTag,
  SanctionType,
} from '@prisma/client/base';

const prisma = new PrismaClient();

function getRandomHexColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export async function seedEnumsColors(): Promise<{
  roles: { role: Role; color: string }[];
  validationStatuses: { validationStatus: ValidationStatus; color: string }[];
  personTypes: { personType: PersonType; color: string }[];
  siteTypes: { siteType: SiteType; color: string }[];
  siteTags: { siteTag: SiteTag; color: string }[];
  sanctionTypes: { sanctionType: SanctionType; color: string }[];
}> {
  let enumsColors: {
    roles: { role: Role; color: string }[];
    validationStatuses: { validationStatus: ValidationStatus; color: string }[];
    personTypes: { personType: PersonType; color: string }[];
    siteTypes: { siteType: SiteType; color: string }[];
    siteTags: { siteTag: SiteTag; color: string }[];
    sanctionTypes: { sanctionType: SanctionType; color: string }[];
  } = {
    roles: [],
    validationStatuses: [],
    personTypes: [],
    siteTypes: [],
    siteTags: [],
    sanctionTypes: [],
  };

  for (const role of Object.values(Role)) {
    enumsColors.roles.push(
      await prisma.roleColor.upsert({
        where: { role },
        update: {},
        create: {
          role,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  for (const validationStatus of Object.values(ValidationStatus)) {
    enumsColors.validationStatuses.push(
      await prisma.validationStatusColor.upsert({
        where: { validationStatus },
        update: {},
        create: {
          validationStatus,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  for (const personType of Object.values(PersonType)) {
    enumsColors.personTypes.push(
      await prisma.personTypeColor.upsert({
        where: { personType },
        update: {},
        create: {
          personType,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  for (const siteType of Object.values(SiteType)) {
    enumsColors.siteTypes.push(
      await prisma.siteTypeColor.upsert({
        where: { siteType },
        update: {},
        create: {
          siteType,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  for (const siteTag of Object.values(SiteTag)) {
    enumsColors.siteTags.push(
      await prisma.siteTagColor.upsert({
        where: { siteTag },
        update: {},
        create: {
          siteTag,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  for (const sanctionType of Object.values(SanctionType)) {
    enumsColors.sanctionTypes.push(
      await prisma.sanctionTypeColor.upsert({
        where: { sanctionType },
        update: {},
        create: {
          sanctionType,
          color: getRandomHexColor(),
        },
      }),
    );
  }

  return enumsColors;
}
