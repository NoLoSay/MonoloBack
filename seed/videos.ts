import { PrismaClient as PrismaBaseClient, Video } from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedVideos(): Promise<Video[]> {
  let videos: Video[] = [];

  const item = await prisma.item.findFirst({
    where: {
      name: 'Chateau des Ducs de Bretagne',
    },
  });

  const profile = await prisma.profile.findFirst({
    where: {
      role: 'CREATOR',
    },
  });

  if (item && profile) {
    videos.push(
      await prisma.video.upsert({
        where: { externalProviderId: 'cn14EKeW2qE' },
        update: {},
        create: {
          externalProviderId: 'cn14EKeW2qE',
          validationStatus: 'VALIDATED',
          itemId: item.id,
          profileId: profile.id,
        },
      })
    );

    videos.push(
      await prisma.video.upsert({
        where: { externalProviderId: 'jOF8nFZeOPY' },
        update: {},
        create: {
          externalProviderId: 'jOF8nFZeOPY',
          validationStatus: 'REFUSED',
          itemId: item.id,
          profileId: profile.id,
        },
      })
    );

    videos.push(
      await prisma.video.upsert({
        where: { externalProviderId: 'QDEryRnm-RA' },
        update: {},
        create: {
          externalProviderId: 'QDEryRnm-RA',
          validationStatus: 'PENDING',
          itemId: item.id,
          profileId: profile.id,
        },
      })
    );
  }

  return videos;
}
