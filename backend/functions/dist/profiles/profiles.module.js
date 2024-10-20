"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const profiles_service_1 = require("./profiles.service");
const profiles_controller_1 = require("./controllers/profiles.controller");
const adwokaci_controller_1 = require("./controllers/adwokaci.controller");
const radcowie_controller_1 = require("./controllers/radcowie.controller");
let ProfilesModule = class ProfilesModule {
};
exports.ProfilesModule = ProfilesModule;
exports.ProfilesModule = ProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule],
        providers: [profiles_service_1.ProfilesService],
        controllers: [profiles_controller_1.ProfilesController, adwokaci_controller_1.AdwokaciController, radcowie_controller_1.RadcowieController],
    })
], ProfilesModule);
//# sourceMappingURL=profiles.module.js.map