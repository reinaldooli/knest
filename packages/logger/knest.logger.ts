import { LoggerService } from "@nestjs/common";
import { Logger as LoggerInstance } from "winston";

import { LoggerOptions } from "./interfaces/logger-options.interface";
import { Logger } from "./logger";

export class KNestLogger implements LoggerService {
    private readonly logger: LoggerInstance;

    constructor(options: LoggerOptions) {
        this.logger = new Logger(options).getLogger();
    }

    log(message: any, context?: string) {
        this.logger.info(`[${context}] ${message}`);
    }
    error(message: any, trace?: string, context?: string) {
        this.logger.error(`[${context}] ${message}`, trace);
    }
    warn(message: any, context?: string) {
        this.logger.warn(`[${context}] ${message}`);
    }
    debug?(message: any, context?: string) {
        this.logger.debug(`[${context}] ${message}`);
    }
    verbose?(message: any, context?: string) {
        this.logger.verbose(`[${context}] ${message}`);
    }
}
