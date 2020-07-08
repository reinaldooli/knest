import { TransportType } from "../enums/transport-type.enum";

export interface Transport {
    datePattern?: string;
    label: string;
    level: string;
    transport: TransportType;
}

export interface ConsoleTransport extends Transport {
    colorize: boolean;
}

export interface FileTransport extends Transport {
    filename: string;
    maxSize: number;
    maxFiles: number;
    json: boolean;
    eol?: string;
    zippedArchive?: boolean;
    silent?: boolean;
    colorize?: boolean;
    prettyPrint?: boolean;
    logstash?: boolean;
    depth?: number;
    tailable?: boolean;
    options?: any;
}

export interface DailyRotateFileTransport extends Transport {
    filename: string;
    maxSize: number;
    maxFiles: number;
    zippedArchive: boolean;
    options: any;
}
