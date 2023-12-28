import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('VideoService', () => {
  let videoService: VideoService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getVideo', () => {
    it('should return 1234', async () => {
      expect(await videoService.getVideo('1234')).toBe('1234');
    });
  });

  describe('getUploadVideoUrl', () => {
    it('should return VideoUrl', async () => {
      const mockedUploadUrl = 'https://mocked-upload-url.com'

      jest.spyOn(httpService, 'get').mockReturnValue(of({
        data: { upload_url: mockedUploadUrl },
      } as AxiosResponse<unknown, any>));

      const result = await videoService['getUploadVideoUrl']();

      expect(result).toBe(mockedUploadUrl);
      expect(httpService.get).toHaveBeenCalledWith('https://api.dailymotion.com/file/upload')
    });
  });

  describe('uploadUrl', () => {
    it('should return upload video and return url', async () => {
      const mockedVideoUrl = 'https://mocked-video-url.com';
      const mockVideoBuffer = Buffer.from('mocked_video_content');
      const mockVideo: any = { buffer: mockVideoBuffer, mimetype: 'video/mp4' };
      const mockUploadUrl = 'https://mocked-upload-url.com';

      jest.spyOn(httpService, 'post').mockReturnValue(of({
        data: { url: mockedVideoUrl },
      } as AxiosResponse<unknown, any>));

      const result = await videoService['uploadVideo'](mockVideo, mockUploadUrl);

      expect(httpService.post).toHaveBeenCalledWith(mockUploadUrl, expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toBe(mockedVideoUrl);
    });
  });

  describe('createDistVideo', () => {
    it('should create a distributed video and return the ID', async () => {
      const mockCreationUrl = 'https://mocked-creation-url.com';
      const mockVideoCreationUrl = `https://api.dailymotion.com/user/${process.env['DAILYMOTION_USER_ID']}/videos`;

      jest.spyOn(httpService, 'post').mockReturnValue(of({
        data: { id: 'mocked_video_id' },
      } as AxiosResponse<unknown, any>));

      const result = await videoService['createDistVideo'](mockCreationUrl);

      expect(httpService.post).toHaveBeenCalledWith(mockVideoCreationUrl, {
        data: {
          url: mockCreationUrl,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toBe('mocked_video_id');
    });
  });

  describe('publishVideo', () => {
    it('should publish a video and return the ID', async () => {
      const mockVideoId = 'mocked_video_id';
      const mockVideoPublishUrl = `https://api.dailymotion.com/video/${mockVideoId}`;

      jest.spyOn(httpService, 'post').mockReturnValue(of({
        data: { id: 'published_video_id' },
      } as AxiosResponse<unknown, any>));

      const result = await videoService['publishVideo'](mockVideoId);

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(mockVideoPublishUrl, {
        data: {
          published: true,
          is_created_for_kids: false,
        },
      });
      expect(result).toBe('published_video_id');
    });
  });
});
