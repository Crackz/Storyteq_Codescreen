import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
    /* 
        Read trades from csv then parse it to calculate the excessive cancellations
    */
    onModuleInit() {}

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
