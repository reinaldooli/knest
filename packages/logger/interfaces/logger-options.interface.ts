import {
    DailyRotateFileTransport,
    FileTransport,
    ConsoleTransport,
} from "./transport.interface";

export interface LoggerOptions {
    basePath: string;
    level?: string;
    transports?: (
        | ConsoleTransport
        | FileTransport
        | DailyRotateFileTransport
    )[];
}

export interface LoggerOptionsFactory {
    createLoggerOptions(): Promise<LoggerOptions> | LoggerOptions;
}
