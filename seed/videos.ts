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

  const signLanguages = await prisma.signLanguage.findMany();

  const providerNoLoSay = await prisma.hostingProvider.upsert({
    where: { name: 'NoLoSay' },
    update: {},
    create: {
      name: 'NoLoSay',
      url: process.env['VIDEO_API_URL'] + '/watch/${videoUUID}',
    },
  });

  const providerYoutube = await prisma.hostingProvider.upsert({
    where: { name: 'Youtube' },
    update: {},
    create: {
      name: 'Youtube',
      url: 'https://www.youtube.com/embed/${providerVideoId}',
    },
  });

  if (item && profile && providerYoutube) {
    videos.push(
      await prisma.video.upsert({
        where: {
          hostingProviderId_hostingProviderVideoId: {
            hostingProviderId: providerYoutube.id,
            hostingProviderVideoId: 'cn14EKeW2qE',
          },
        },
        create: {
          hostingProviderId: providerYoutube.id,
          hostingProviderVideoId: 'cn14EKeW2qE',
          validationStatus: 'VALIDATED',
          itemId: item.id,
          profileId: profile.id,
          signLanguageId: signLanguages.find((sl) => sl.code === 'LSF')?.id,
        },
        update: {},
      }),
    );

    videos.push(
      await prisma.video.upsert({
        where: {
          hostingProviderId_hostingProviderVideoId: {
            hostingProviderId: providerYoutube.id,
            hostingProviderVideoId: 'jOF8nFZeOPY',
          },
        },
        update: {},
        create: {
          hostingProviderId: providerYoutube.id,
          hostingProviderVideoId: 'jOF8nFZeOPY',
          validationStatus: 'REFUSED',
          itemId: item.id,
          profileId: profile.id,
          signLanguageId: signLanguages.find((sl) => sl.code === 'LSFB')?.id,
        },
      }),
    );

    videos.push(
      await prisma.video.upsert({
        where: {
          hostingProviderId_hostingProviderVideoId: {
            hostingProviderId: providerYoutube.id,
            hostingProviderVideoId: 'QDEryRnm-RA',
          },
        },
        update: {},
        create: {
          hostingProviderId: providerYoutube.id,
          hostingProviderVideoId: 'QDEryRnm-RA',
          validationStatus: 'PENDING',
          itemId: item.id,
          profileId: profile.id,
          signLanguageId: signLanguages.find((sl) => sl.code === 'VGT')?.id,
        },
      }),
    );
  }

  return videos;
}
