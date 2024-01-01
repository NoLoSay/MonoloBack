import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { createReadStream, statSync } from 'fs';
import 'multer';
import multer = require('multer');
import { clearLine, cursorTo } from 'readline';

// const youtube = google.youtube({
//   version: 'v3',
//   // auth: 'redacted',
//   key: 'redacted'
// })

const youtube = google.youtube('v3');

@Injectable()
export class VideoService {
  constructor() {}

  async getYoutube(youtubeId: string): Promise<string | undefined> {
    youtube.videos
      .list({
        chart: 'mostPopular',
        regionCode: 'US',
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
    //   const auth = await authenticate({
    //     keyfilePath: '/app/client_secret.apps.googleusercontent.com.json',
    //     scopes: [
    //       'https://www.googleapis.com/auth/youtube.upload',
    //       'https://www.googleapis.com/auth/youtube',
    //     ],
    //   });
    //   google.options({auth});

    //   const fileSize = fs.statSync(fileName).size;
    //   const res = await youtube.videos.insert(
    //     {
    //       part: ['id', 'snippet', 'status'],
    //       notifySubscribers: false,
    //       requestBody: {
    //         snippet: {
    //           title: 'Node.js YouTube Upload Test',
    //           description: 'Testing YouTube upload via Google APIs Node.js Client',
    //         },
    //         status: {
    //           privacyStatus: 'private',
    //         },
    //       },
    //       media: {
    //         body: fs.createReadStream(fileName),
    //       },
    //     },
    //     {
    //       onUploadProgress: evt => {
    //         const progress = (evt.bytesRead / fileSize) * 100;
    //         readline.clearLine(process.stdout, 0);
    //         readline.cursorTo(process.stdout, 0, null);
    //         process.stdout.write(`${Math.round(progress)}% complete`);
    //       },
    //     }
    //   );
    //   console.log('\n\n');
    //   console.log(res.data);
    // try {
    console.log(video.path);
    const fileSize = statSync(video.path).size;
    console.log(fileSize);
    const test = youtube.videos.insert(
      {
        oauth_token: process.env['YOUTUBE_TOKEN'],
        part: ['snippet', 'contentDetails', 'status'],

        requestBody: {
          snippet: {
            title: 'NoLoTest',
            description: 'My description',
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
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          clearLine(process.stdout, 0);
          cursorTo(process.stdout, 0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );
    console.log(test);
    return 'publishedYoutubeId';
  }
}
