import { google, youtube_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import { createReadStream, readFileSync, statSync } from 'fs';

@Injectable()
export class VideoService {
  private auth: JWT;
  private youtube: youtube_v3.Youtube;

  constructor() {
    const serviceAccount = JSON.parse(
      readFileSync('secrets/google-service-account.json', 'utf-8')
    );

    this.auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
      ],
      undefined
    );

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.auth,
    });
  }

  async getYoutube(youtubeId: string): Promise<string | undefined> {
    this.youtube.videos
      .list({
        chart: 'mostPopular',
        regionCode: 'FR',
        part: [
          'contentDetails',
          'id',
          'liveStreamingDetails',
          'localizations',
          'player',
          'recordingDetails',
          'snippet',
          'statistics',
          'status',
          'topicDetails',
        ],
      })
      .then((v) => {
        console.dir(v.data);
      });
    return youtubeId;
  }

  async createYoutube(video: Express.Multer.File): Promise<string> {
    const fileSize = statSync(video.path).size;
    const res = await this.youtube.videos.insert(
      {
        part: ['id', 'snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'Test video',
            description: 'Test video',
            tags: ['tag1', 'tag2'],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: createReadStream(video.path),
        },
      },
      {
        onUploadProgress: (event) => {
          const progress = (event.bytesRead / fileSize) * 100;
          console.log(`Progress: ${Math.round(progress)}%`);
        },
      }
    );

    if ('data' in res) {
      console.log(res.data);
      return res.data.id ?? '';
    } else {
      throw new Error('Upload failed');
    }
  }
}
