import { Module, OnModuleInit } from "@nestjs/common";
import {
    LoggerModule,
    TransportType,
    InjectLogger,
    KNestLogger,
} from "../../packages/logger";
import { join } from "path";

@Module({
    imports: [
        LoggerModule.forRoot({
            basePath: join(__dirname, "log"),
            level: "debug",
            transports: [
                {
                    level: "debug",
                    transport: TransportType.CONSOLE,
                    colorize: true,
                    label: "console",
                },
                {
                    level: "debug",
                    transport: TransportType.FILE,
                    colorize: false,
                    filename: "info.log",
                    datePattern: "YYYY-MM-DD hh:mm:ss",
                    maxSize: 104857600,
                    json: false,
                    maxFiles: 10,
                    prettyPrint: true,
                    label: "file",
                },
            ],
        }),
    ],
})
export class AppModule implements OnModuleInit {
    constructor(
        @InjectLogger()
        private readonly logger: KNestLogger,
    ) {}
    onModuleInit() {
        this.logger.log("This is an info level log message", "AppModule");
        this.logger.debug("This is a debug level log message", "AppModule");
        this.logger.error(
            "This is a error level log message",
            null,
            "AppModule",
        );
        this.logger.warn("This is a warn level log message", "AppModule");
        this.logger.verbose("This is a verbose level log message", "AppModule");
    }
}
