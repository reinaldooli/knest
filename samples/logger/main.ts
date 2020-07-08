import { NestFactory } from "@nestjs/core";

import { LOGGER } from "../../packages/logger/logger.constants";

import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });
    app.useLogger(app.get(LOGGER));
    app.listen(3000);
}

bootstrap();
