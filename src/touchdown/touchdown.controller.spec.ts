import { Test, TestingModule } from '@nestjs/testing';
import { TouchdownController } from './touchdown.controller';

describe('Touchdown Controller', () => {
  let controller: TouchdownController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TouchdownController],
    }).compile();

    controller = module.get<TouchdownController>(TouchdownController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
