import { Injectable, Logger } from '@nestjs/common';
import { Trade } from './utils/trade';

@Injectable()
export class TradesService {
    private _logger = new Logger('Trades');

    handle(trade: Trade): void {
        // this._logger.log({ ...trade });
    }

    /**
     * Returns the list of companies that are involved in excessive cancelling.
     * Note this should always resolve an array or throw error.
     */
    async companiesInvolvedInExcessiveCancellations() {
        //TODO Implement...
    }

    /**
     * Returns the total number of companies that are not involved in any excessive cancelling.
     * Note this should always resolve a number or throw error.
     */
    async totalNumberOfWellBehavedCompanies() {
        //TODO Implement...
    }
}
