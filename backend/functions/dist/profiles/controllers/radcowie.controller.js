"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadcowieController = void 0;
const common_1 = require("@nestjs/common");
const base_profiles_controller_1 = require("../base-profiles.controller");
const profiles_service_1 = require("../profiles.service");
let RadcowieController = class RadcowieController extends base_profiles_controller_1.BaseProfilesController {
    constructor(profilesService) {
        super(profilesService, 'radcowie');
    }
};
exports.RadcowieController = RadcowieController;
exports.RadcowieController = RadcowieController = __decorate([
    (0, common_1.Controller)('radcowie'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService])
], RadcowieController);
//# sourceMappingURL=radcowie.controller.js.map