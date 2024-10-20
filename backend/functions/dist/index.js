"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const https_1 = require("firebase-functions/v2/https");
const common_1 = require("@nestjs/common");
const server = (0, express_1.default)();
async function createNestServer() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.enableCors({
        origin: ['http://localhost:4200', 'https://rankingi-34df6.web.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.init();
}
createNestServer();
exports.api = (0, https_1.onRequest)({ cors: true }, server);
//# sourceMappingURL=index.js.map