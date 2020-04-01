import { Test, TestingModule } from '@nestjs/testing';
import { TouchdownService } from './touchdown.service';

describe('TouchdownService', () => {
  let service: TouchdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TouchdownService],
    }).compile();

    service = module.get<TouchdownService>(TouchdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
