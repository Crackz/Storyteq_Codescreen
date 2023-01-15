export enum TradeOrderType {
    NEW_ORDER = 'D',
    CANCELLATION = 'F',
}

export class Trade {
    date: Date;
    companyName: string;
    orderType: TradeOrderType;
    quantity: number;

    constructor(date: string, companyName: string, orderType: string, quantity: string) {
        this.date = this._checkDate(date);
        this.companyName = this._checkCompanyName(companyName);
        this.orderType = this._checkOrderType(orderType);
        this.quantity = this._checkQuantity(quantity);
    }

    private _checkDate(date?: string): Date {
        const parsedDate = Date.parse(date);
        if (isNaN(parsedDate)) {
            throw new Error(`Couldn't parse date: ${date}`);
        }
        return new Date(parsedDate);
    }

    private _checkOrderType(orderType?: string): TradeOrderType {
        switch (orderType) {
            case 'D':
                return TradeOrderType.NEW_ORDER;
            case 'F':
                return TradeOrderType.CANCELLATION;
            default:
                throw new Error(`Couldn't parse order type '${orderType}'`);
        }
    }

    private _checkCompanyName(companyName?: string): string {
        if (!companyName || companyName.length === 0)
            throw new Error('Company should have at least 1 char');
        return companyName;
    }

    private _checkQuantity(quantity?: string) {
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity)) {
            throw new Error(`Couldn't parse quantity: ${quantity}`);
        }
        return parsedQuantity;
    }

    getDateInSeconds(): number {
        return this.date.getTime() / 1000;
    }
}
