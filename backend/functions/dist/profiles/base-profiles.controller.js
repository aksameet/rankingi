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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProfilesController = void 0;
const common_1 = require("@nestjs/common");
const profiles_service_1 = require("./profiles.service");
const bulk_create_profile_dto_1 = require("./dto/bulk-create-profile.dto");
const passport_1 = require("@nestjs/passport");
let BaseProfilesController = class BaseProfilesController {
    constructor(profilesService, collectionName) {
        this.profilesService = profilesService;
        this.collectionName = collectionName;
    }
    async create(createProfileDto) {
        return this.profilesService.create(this.collectionName, createProfileDto);
    }
    async createBulk(bulkCreateProfileDto) {
        return this.profilesService.createBulkProfiles(this.collectionName, bulkCreateProfileDto);
    }
    async findAll() {
        return this.profilesService.findAll(this.collectionName);
    }
    async findAllByCity(cityName) {
        return this.profilesService.findAllByCity(this.collectionName, cityName);
    }
    async findOne(id) {
        return this.profilesService.findOne(this.collectionName, id);
    }
    async update(id, updateData) {
        return this.profilesService.update(this.collectionName, id, updateData);
    }
    async remove(id) {
        return this.profilesService.remove(this.collectionName, id);
    }
    async deleteAll() {
        const result = await this.profilesService.deleteAll(this.collectionName);
        return {
            message: 'All profiles have been deleted successfully.',
            deletedCount: result.deletedCount,
        };
    }
    async deleteAllByCity(cityName) {
        const result = await this.profilesService.deleteAllByCity(this.collectionName, cityName);
        return {
            message: `All profiles in city "${cityName}" have been deleted successfully.`,
            deletedCount: result.deletedCount,
        };
    }
};
exports.BaseProfilesController = BaseProfilesController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_profile_dto_1.CreateProfileDto]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_profile_dto_1.BulkCreateProfileDto]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "createBulk", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('city/:cityName'),
    __param(0, (0, common_1.Param)('cityName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "findAllByCity", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "deleteAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('city/:cityName'),
    __param(0, (0, common_1.Param)('cityName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseProfilesController.prototype, "deleteAllByCity", null);
exports.BaseProfilesController = BaseProfilesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService, String])
], BaseProfilesController);
//# sourceMappingURL=base-profiles.controller.js.map