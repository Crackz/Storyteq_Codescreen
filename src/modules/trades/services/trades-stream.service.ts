import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { TradesService } from './trades.service';
import { Trade } from '../utils/trade';

@Injectable()
export class TradesStreamService implements OnModuleInit, OnModuleDestroy {
    private _logger = new Logger('Trades Stream');
    private _tradesCSVPath = path.join(__dirname, '../../../assets/trades.csv');
    private _tradesStream: fs.ReadStream;
    private _tradesReadLine: readline.ReadLine;

    constructor(private readonly _tradesService: TradesService) {}

    async onModuleInit() {
        await this._parseTradesCSV();
    }

    /* 
        Read trades from csv then parse it to calculate the excessive cancellations
    */
    async _parseTradesCSV() {
        return await new Promise<void>((resolve, reject) => {
            this._tradesStream = this._initTradesStream((err) => reject(err));

            this._tradesReadLine = this._initTradeReadLine(
                (trade) => this._tradesService.handle(trade),
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
                this._logger.warn(`Ignored Line: ${line}`, err);
            }
        });

        tradesReader.on('close', () => onClose());
        tradesReader.on('error', (err) => onError(err));
        return tradesReader;
    }

    onModuleDestroy() {
        this._logger.log('Closing Stream');
        if (this._tradesReadLine) this._tradesReadLine.close();
        if (this._tradesStream) this._tradesStream.close();
    }
}
