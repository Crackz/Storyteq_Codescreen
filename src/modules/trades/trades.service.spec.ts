import { Test, TestingModule } from '@nestjs/testing';
import { TradesService } from './trades.service';

// import { ExcessiveCancellationsChecker } from '../excessive-cancellations-checker.js';

// const checker = new ExcessiveCancellationsChecker('./data/trades.csv');

// describe('Excessive Cancellations Test', () => {
//     describe('calculate', () => {
//         it('generates the list of companies that are involved in excessive cancelling', async () => {
//             const companiesList = await checker.companiesInvolvedInExcessiveCancellations();
//             expect(companiesList).toEqual(['Ape accountants', 'Cauldron cooking']);
//         });
//     });
// });

describe('TradesService', () => {
    let service: TradesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TradesService],
        }).compile();

        service = module.get<TradesService>(TradesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
