import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Trade } from './utils/trade';

@Injectable()
export class TradesService implements OnModuleInit, OnModuleDestroy {
    private _logger = new Logger('App');
    private _tradesCSVPath = path.join(__dirname, '../../assets/trades.csv');
    private _tradesStream: fs.ReadStream;
    private _tradesReadLine: readline.ReadLine;

    async onModuleInit() {
        await this._parseTradesCSV();
    }

    onModuleDestroy() {
        this._logger.log('Closing Stream');
        if (this._tradesReadLine) this._tradesReadLine.close();
        if (this._tradesStream) this._tradesStream.close();
    }

    /* 
        Read trades from csv then parse it to calculate the excessive cancellations
    */
    async _parseTradesCSV() {
        return await new Promise<void>((resolve, reject) => {
            this._tradesStream = this._initTradesStream((err) => reject(err));

            this._tradesReadLine = this._initTradeReadLine(
                (trade) => this.handleTrade(trade),
                () => {
                    this._logger.log('Finished parsing trades');
                    resolve();
                },
                (err) => reject(err),
            );
        });
    }

    private _initTradesStream(onError: (err: Error) => void): fs.ReadStream {
        const tradesStream = fs.createReadStream(this._tradesCSVPath);
        tradesStream.on('error', (err) => onError(err));
        return tradesStream;
    }

    private _initTradeReadLine(
        onTrade: (trade: Trade) => void,
        onClose: () => void,
        onError: (err: Error) => void,
    ): readline.ReadLine {
        if (!this._tradesStream) throw new Error('Trades stream should be initialized first');

        const tradesReader = readline.createInterface({ input: this._tradesStream });

        tradesReader.on('line', (line: string): void => {
            // parse a line and convert it to a trade
            const [date, companyName, orderType, quantity] = line.split(',');
            try {
                const trade = new Trade(date, companyName, orderType, quantity);
                onTrade(trade);
            } catch (err: unknown) {
                this._logger.verbose(`Ignored Line: ${line}`);
            }
        });

        tradesReader.on('close', () => onClose());
        tradesReader.on('error', (err) => onError(err));
        return tradesReader;
    }

    handleTrade(trade: Trade): void {
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
