import { Global, Module, DynamicModule } from "@nestjs/common";

import { LOGGER, LOGGER_OPTIONS } from "./logger.constants";
import { LoggerOptions } from "./interfaces/logger-options.interface";
import { KNestLogger } from "./knest.logger";

@Global()
@Module({})
export class LoggerModule {
    private static logger: KNestLogger;

    static forRoot(options: LoggerOptions): DynamicModule {
        const loggerProvider = {
            provide: LOGGER,
            useFactory: (options: LoggerOptions): KNestLogger => {
                if (!this.logger) {
                    this.logger = new KNestLogger(options);
                }

                return this.logger;
            },
            inject: [LOGGER_OPTIONS],
        };

        return {
            module: LoggerModule,
            providers: [
                {
                    provide: LOGGER_OPTIONS,
                    useValue: options,
                },
                loggerProvider,
            ],
            exports: [loggerProvider],
        };
    }
}
