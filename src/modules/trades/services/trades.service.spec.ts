import { Test, TestingModule } from '@nestjs/testing';
import { TradesService } from './trades.service';
import { TradesStreamService } from './trades-stream.service';

describe('TradesService', () => {
    let service: TradesService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TradesService, TradesStreamService],
        }).compile();

        service = module.get<TradesService>(TradesService);

        await module.init();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generates the list of companies that are involved in excessive cancelling', async () => {
        const companiesList = service.companiesInvolvedInExcessiveCancellations();
        expect(companiesList).toEqual(['Ape accountants', 'Cauldron cooking']);
    });

    it('should return total number of well behaved companies', async () => {
        const totalNumberOfWellBehavedCompanies = service.totalNumberOfWellBehavedCompanies();
        expect(totalNumberOfWellBehavedCompanies).toEqual(12);
    });
});
