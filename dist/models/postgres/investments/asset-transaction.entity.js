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
exports.AssetTransaction = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
let AssetTransaction = class AssetTransaction {
};
exports.AssetTransaction = AssetTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssetTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id' }),
    __metadata("design:type", String)
], AssetTransaction.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_entity_1.Asset),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", asset_entity_1.Asset)
], AssetTransaction.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], AssetTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date' }),
    __metadata("design:type", Date)
], AssetTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        type: 'enum',
        enum: ['BUY', 'SELL'],
    }),
    __metadata("design:type", String)
], AssetTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], AssetTransaction.prototype, "units", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_per_unit', type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], AssetTransaction.prototype, "pricePerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], AssetTransaction.prototype, "fees", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], AssetTransaction.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AssetTransaction.prototype, "createdAt", void 0);
exports.AssetTransaction = AssetTransaction = __decorate([
    (0, typeorm_1.Entity)('asset_transactions')
], AssetTransaction);
//# sourceMappingURL=asset-transaction.entity.js.map