import { Injectable, Logger } from '@nestjs/common';
import { IntervalTree, Interval } from 'node-interval-tree';
import { CompanyTradeInterval } from './interfaces/trade-interval';
import { TradeOrderType, Trade } from './utils/trade';

@Injectable()
export class TradesService {
    private _logger = new Logger('Trades');
    private _companiesIntervalsTrees = new Map<string, IntervalTree<CompanyTradeInterval>>();
    private _wellBehavedCompanies = new Set<string>();
    private _excessiveCancellingCompanies = new Set<string>();
    private _cappedTradingDurationInSeconds = 60;
    private _excessiveRatio = 1 / 3;

    private _isFirstTimeTrading(companyName: string): boolean {
        return !this._companiesIntervalsTrees.has(companyName);
    }

    private _isExcessiveCancellingCompany(companyName: string): boolean {
        return this._excessiveCancellingCompanies.has(companyName);
    }

    private _addCompanyTradeInterval(trade: Trade) {
        const interval: Interval = {
            low: trade.getDateInSeconds(),
            high: trade.getDateInSeconds() + this._cappedTradingDurationInSeconds,
        };

        // TODO: handle a case where the same company has two trades with same time interval and order type

        this._companiesIntervalsTrees.get(trade.companyName).insert({
            ...interval,
            orderType: trade.orderType,
            quantity: trade.quantity,
        });
    }

    private _handleFirstTimeCompanyTrade(trade: Trade): void {
        const intervalTree = new IntervalTree<CompanyTradeInterval>();
        this._companiesIntervalsTrees.set(trade.companyName, intervalTree);
        this._addCompanyTradeInterval(trade);

        this._wellBehavedCompanies.add(trade.companyName);
    }

    private _handleCompanyTrade(trade: Trade): void {
        const companyTradingRatio = this._getCompanyTradingRatio(trade);

        if (companyTradingRatio > this._excessiveRatio) {
            this._wellBehavedCompanies.delete(trade.companyName);
            this._excessiveCancellingCompanies.add(trade.companyName);

            //TODO: Clean Up The Company Interval Tree To Save Some Memory
            return;
        }

        this._addCompanyTradeInterval(trade);
    }

    private _countOrdersAndCancellations(tradesIntervals: CompanyTradeInterval[]) {
        let newOrdersQuantity = 0;
        let cancellationQuantity = 0;
        for (const tradeInterval of tradesIntervals) {
            if (tradeInterval.orderType === TradeOrderType.NEW_ORDER) {
                newOrdersQuantity += tradeInterval.quantity;
            } else {
                cancellationQuantity += tradeInterval.quantity;
            }
        }

        return { newOrdersQuantity, cancellationQuantity };
    }

    private _getCompanyTradingRatio(trade: Trade): number {
        const companyIntervalTree = this._companiesIntervalsTrees.get(trade.companyName);
        const tradesWithinCappedDuration: CompanyTradeInterval[] = companyIntervalTree.search(
            trade.getDateInSeconds() - this._cappedTradingDurationInSeconds,
            trade.getDateInSeconds(),
        );

        let { newOrdersQuantity, cancellationQuantity } = this._countOrdersAndCancellations(
            tradesWithinCappedDuration,
        );

        newOrdersQuantity += trade.orderType === TradeOrderType.NEW_ORDER ? trade.quantity : 0;
        cancellationQuantity +=
            trade.orderType === TradeOrderType.CANCELLATION ? trade.quantity : 0;

        return cancellationQuantity / newOrdersQuantity;
    }

    handle(trade: Trade): void {
        if (this._isExcessiveCancellingCompany(trade.companyName)) return;

        if (this._isFirstTimeTrading(trade.companyName)) {
            this._handleFirstTimeCompanyTrade(trade);
        } else {
            this._handleCompanyTrade(trade);
        }
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
