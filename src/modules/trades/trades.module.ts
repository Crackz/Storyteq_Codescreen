import { Module } from '@nestjs/common';
import { TradesStreamService } from './services/trades-stream.service';
import { TradesService } from './services/trades.service';

@Module({
    providers: [TradesStreamService, TradesService],
})
export class TradesModule {}
