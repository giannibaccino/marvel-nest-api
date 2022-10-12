import { Test, TestingModule } from '@nestjs/testing';
import { ComicSummaryService } from './comic-summary.service';

describe('ComicSummaryService', () => {
  let service: ComicSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComicSummaryService],
    }).compile();

    service = module.get<ComicSummaryService>(ComicSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
