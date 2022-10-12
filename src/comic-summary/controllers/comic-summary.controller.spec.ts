import { Test, TestingModule } from '@nestjs/testing';
import { ComicSummaryController } from './comic-summary.controller';

describe('ComicSummaryController', () => {
  let controller: ComicSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComicSummaryController],
    }).compile();

    controller = module.get<ComicSummaryController>(ComicSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
