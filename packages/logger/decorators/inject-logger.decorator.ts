import "reflect-metadata";
import { Inject } from "@nestjs/common";
import { LOGGER } from "../logger.constants";

export const InjectLogger = () => Inject(LOGGER);
