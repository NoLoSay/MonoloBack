import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from '@noloback/video.service';
import { NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';

jest.mock('@noloback/video.service');

describe('VideoController', () => {
  let controller: VideoController;
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [VideoService],
    }).compile();

    controller = module.get<VideoController>(VideoController);
    service = module.get<VideoService>(VideoService);
  });


  it('should be truthy', () => {
    expect(controller).toBeTruthy();
  });

  describe('getVideo', () => {
    it('should return the video content if video is found', async () => {
      const videoId = 'someId';
      const videoContent = 'someVideoContent';
      jest.spyOn(service, 'getVideo').mockResolvedValue(videoContent);

      const result = await controller.getVideo(videoId);

      expect(result).toEqual(
        '<body><script src="https://geo.dailymotion.com/libs/player/xcdyd.js"></script><div id="my-dailymotion-player">Loading player...</div><script>dailymotion.createPlayer("my-dailymotion-player", { video: "' +
          videoContent +
          '" }).then((player) => console.log(player)).catch((e) => console.error(e));</script></body>',
      );
    });

    it('should throw NotFoundException if video is not found', async () => {
      const videoId = 'nonexistentId';
      jest.spyOn(service, 'getVideo').mockResolvedValue(undefined);

      await expect(controller.getVideo(videoId)).rejects.toThrowError(
        new NotFoundException('Video not found'),
      );
    });
  });

  describe('createVideo', () => {
    it('should create a video and return the result', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        destination: '/tmp',
        filename: 'test.mp4',
        path: '/tmp/test.mp4',
        size: 1024,
        stream: Readable.from('mocked content'),
        buffer: Buffer.from('mocked content'),
      };
      const createdVideo = 'video_created';
      jest.spyOn(service, 'createVideo').mockResolvedValue(createdVideo);

      const result = await controller.createVideo(mockFile);

      expect(result).toBe(createdVideo);
      expect(service.createVideo).toHaveBeenCalledWith(mockFile);
    });
  });
});
