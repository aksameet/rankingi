"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const functions = require("firebase-functions");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const server = express();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://localhost:4200', 'https://rankingi-34df6.web.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.init();
}
if (process.env.NODE_ENV !== 'production') {
    bootstrap().then(() => {
        server.listen(3000, () => {
            console.log('NestJS server is running locally on http://localhost:3000');
        });
    });
}
else {
    bootstrap();
}
exports.api = functions.https.onRequest(server);
//# sourceMappingURL=main.js.map