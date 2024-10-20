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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const profile_schema_1 = require("./schemas/profile.schema");
let ProfilesService = class ProfilesService {
    constructor(connection) {
        this.connection = connection;
        this.models = new Map();
        this.allowedCollections = ['profiles', 'adwokaci', 'radcowie'];
    }
    getModel(collectionName) {
        if (!this.allowedCollections.includes(collectionName)) {
            throw new common_1.BadRequestException(`Collection "${collectionName}" is not allowed.`);
        }
        if (!this.models.has(collectionName)) {
            const model = this.connection.model('Profile', profile_schema_1.ProfileSchema, collectionName);
            this.models.set(collectionName, model);
        }
        return this.models.get(collectionName);
    }
    async create(collectionName, profileData) {
        const model = this.getModel(collectionName);
        const createdProfile = new model(profileData);
        return createdProfile.save();
    }
    async createBulkProfiles(collectionName, bulkData) {
        const model = this.getModel(collectionName);
        const bulkOps = bulkData.profiles.map((profile) => ({
            updateOne: {
                filter: { email: profile.email },
                update: { $set: profile },
                upsert: true,
            },
        }));
        await model.bulkWrite(bulkOps, { ordered: false });
        const emails = bulkData.profiles.map((profile) => profile.email);
        return model.find({ email: { $in: emails } }).exec();
    }
    async findAll(collectionName) {
        const model = this.getModel(collectionName);
        return model.find().exec();
    }
    async findAllByCity(collectionName, city) {
        const model = this.getModel(collectionName);
        return model.find({ city }).exec();
    }
    async findOne(collectionName, id) {
        const model = this.getModel(collectionName);
        const profile = await model.findById(id).exec();
        if (!profile) {
            throw new common_1.NotFoundException(`Profile with ID "${id}" not found`);
        }
        return profile;
    }
    async update(collectionName, id, updateData) {
        const model = this.getModel(collectionName);
        const updatedProfile = await model
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updatedProfile) {
            throw new common_1.NotFoundException(`Profile with ID "${id}" not found`);
        }
        return updatedProfile;
    }
    async remove(collectionName, id) {
        const model = this.getModel(collectionName);
        const deletedProfile = await model.findByIdAndDelete(id).exec();
        if (!deletedProfile) {
            throw new common_1.NotFoundException(`Profile with ID "${id}" not found`);
        }
    }
    async deleteAll(collectionName) {
        const model = this.getModel(collectionName);
        const result = await model.deleteMany({});
        return { deletedCount: result.deletedCount };
    }
    async deleteAllByCity(collectionName, city) {
        const model = this.getModel(collectionName);
        const result = await model.deleteMany({ city });
        return { deletedCount: result.deletedCount };
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map