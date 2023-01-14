import { Module } from '@nestjs/common';
import { TradesModule } from './modules/trades/trades.module';

@Module({
    imports: [TradesModule],
    providers: [],
})
export class AppModule {}
