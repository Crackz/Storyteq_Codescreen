import { Module } from '@nestjs/common';
import { TradesStreamService } from './trades-stream.service';
import { TradesService } from './trades.service';

@Module({
    providers: [TradesStreamService, TradesService],
})
export class TradesModule {}
