import { Interval } from 'node-interval-tree';
import { TradeOrderType } from '../utils/trade';

export interface CompanyTradeInterval extends Interval {
    quantity: number;
    orderType: TradeOrderType;
}
