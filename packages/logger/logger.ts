import * as winston from "winston";
import { Logger as LoggerInstance } from "winston";
import "winston-daily-rotate-file";

import { LoggerOptions } from "./interfaces/logger-options.interface";
import { TransportBuilder } from "./transport.builder";

export class Logger {
    private readonly basePath: string;
    private readonly options: LoggerOptions;
    private logger: LoggerInstance;

    constructor(options: LoggerOptions) {
        this.basePath = options.basePath;
        this.options = options;
        this.init();
    }

    getLogger(): LoggerInstance {
        return this.logger;
    }

    private init() {
        const builder = new TransportBuilder(this.basePath);
        this.logger = winston.createLogger({
            level: this.options.level,
            transports: builder.build(this.options.transports),
        });
    }
}
