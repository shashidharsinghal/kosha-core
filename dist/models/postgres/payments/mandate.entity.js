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
exports.Mandate = void 0;
const typeorm_1 = require("typeorm");
let Mandate = class Mandate {
};
exports.Mandate = Mandate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Mandate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Mandate.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bill_id' }),
    __metadata("design:type", String)
], Mandate.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'upi_account_id' }),
    __metadata("design:type", String)
], Mandate.prototype, "upiAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Mandate.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['MONTHLY', 'YEARLY', 'WEEKLY'],
    }),
    __metadata("design:type", String)
], Mandate.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_due_date' }),
    __metadata("design:type", Date)
], Mandate.prototype, "nextDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['ACTIVE', 'PAUSED', 'CANCELLED'],
        default: 'ACTIVE',
    }),
    __metadata("design:type", String)
], Mandate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_mandate_id', nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "providerMandateId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Mandate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Mandate.prototype, "updatedAt", void 0);
exports.Mandate = Mandate = __decorate([
    (0, typeorm_1.Entity)('mandates')
], Mandate);
//# sourceMappingURL=mandate.entity.js.map