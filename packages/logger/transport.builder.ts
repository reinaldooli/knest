import * as fs from "fs";
import { resolve } from "path";
import { sync } from "mkdirp";
import { transport as TransportInstance, transports, format } from "winston";

import {
    ConsoleTransport,
    FileTransport,
    DailyRotateFileTransport,
} from "./interfaces/transport.interface";
import { TransportType } from "./enums/transport-type.enum";

export class TransportBuilder {
    constructor(private readonly basePath: string) {}

    public build(
        transports: (
            | ConsoleTransport
            | FileTransport
            | DailyRotateFileTransport
        )[],
    ): TransportInstance[] {
        const instances: TransportInstance[] = transports.map((item) => {
            switch (item.transport) {
                case TransportType.FILE:
                    return this.buildFileTransport(item as FileTransport);
                case TransportType.DAILY_ROTATE:
                    return this.buildDailyRotateTransport(
                        item as DailyRotateFileTransport,
                    );
                case TransportType.CONSOLE:
                default:
                    return this.buildConsoleTransport(item as ConsoleTransport);
            }
        });

        if (instances.length === 0) {
            instances.push(this.buildDefaultTransport());
        }

        return instances;
    }

    private createLogPath(filename: string): string {
        if (filename.charAt(0) !== "/") {
            filename = resolve(this.basePath, filename);
        }

        const last = filename.indexOf("/");
        const path = filename.substring(0, last);
        if (!fs.existsSync(path)) {
            sync(path);
        }

        return filename;
    }

    private buildFileTransport(config: FileTransport): TransportInstance {
        const {
            filename,
            datePattern,
            json,
            colorize,
            logstash,
            prettyPrint,
            ...configs
        } = config;

        const formats: any[] = [];
        if (json) formats.push(format.json());
        if (colorize) formats.push(format.colorize());
        if (logstash) formats.push(format.logstash());
        if (prettyPrint) formats.push(format.prettyPrint());
        formats.push(format.timestamp({ format: "YYYY-DD-MM hh:mm:ss" }));
        formats.push(format.printf((args) => this.knestFormat(args)));

        return new transports.File({
            ...configs,
            filename: this.createLogPath(filename),
            format: format.combine(...formats),
        });
    }

    private buildDailyRotateTransport(
        config: DailyRotateFileTransport,
    ): TransportInstance {
        const { filename, ...configs } = config;

        return new transports.DailyRotateFile({
            ...configs,
            filename: this.createLogPath(filename),
            datePattern: config.datePattern || "YYYY-MM-DD hh:mm:ss",
        });
    }

    private buildConsoleTransport(config: ConsoleTransport): TransportInstance {
        const { colorize, ...configs } = config;
        const formats: any[] = [];

        if (colorize) formats.push(format.colorize());
        formats.push(format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }));
        formats.push(format.prettyPrint());
        formats.push(format.printf((args) => this.knestFormat(args)));

        return new transports.Console({
            ...configs,
            level: "debug",
            format: format.combine(...formats),
        });
    }

    private buildDefaultTransport(): TransportInstance {
        return new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: "YYYY-MM-DD h:mm:ss" }),
                format.prettyPrint(),
                format.printf((args) => this.knestFormat(args)),
            ),
        });
    }

    private knestFormat({ level, timestamp, message }: any): string {
        return `${timestamp} - ${level}: ${message}`;
    }
}
