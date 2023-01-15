import { Logger, ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TradesService } from './modules/trades/services/trades.service';

async function bootstrap() {
    const logger = new Logger('App');
    const app = await NestFactory.create(AppModule);
    app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

    await app.init();

    const tradesService = app.get(TradesService);

    logger.verbose(
        `companiesInvolvedInExcessiveCancellation: ${tradesService.companiesInvolvedInExcessiveCancellations()}`,
    );

    logger.verbose(
        `totalNumberOfWellBehavedCompanies: ${tradesService.totalNumberOfWellBehavedCompanies()}`,
    );
}

bootstrap();
