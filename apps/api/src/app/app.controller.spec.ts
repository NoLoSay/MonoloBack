import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  //test 'getData'
  describe('getData', () => {
    it('should return "Hello API"', () => {
      const result = {message : "Hello im the API"};
      const appController = app.get<AppController>(AppController);

      //Jest spyOn will modify the return of the function in the service.
      //For example, getData() function return "Hello API" in the service,
      //but when i use the spyOn now the new return is the result const defined before.
      jest.spyOn(appController, 'getData').mockImplementation(() => result);

      expect(appController.getData()).toEqual({ message: 'Hello im the API' });
    });
  });
});
