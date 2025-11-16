"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillController = void 0;
const bill_service_1 = require("../../services/bills/bill.service");
class BillController {
    constructor() {
        this.billService = new bill_service_1.BillService();
    }
    async upsertBill(req, res) {
        const userId = req.userId;
        const billData = req.body;
        try {
            const bill = await this.billService.upsertBill(userId, billData);
            res.status(201).json({ data: bill });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listBills(req, res) {
        const userId = req.userId;
        const { status, type, startDate, endDate, page = '1', limit = '20', sort, } = req.query;
        try {
            const filters = {};
            if (status)
                filters.status = status;
            if (type)
                filters.type = type;
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort,
            };
            const result = await this.billService.listBills(userId, filters, pagination);
            res.status(200).json({
                data: result.bills,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async listUpcomingBills(req, res) {
        const userId = req.userId;
        const days = req.query.days ? parseInt(req.query.days) : 30;
        try {
            const bills = await this.billService.listUpcomingBills(userId, days);
            res.status(200).json({ data: bills });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async markBillPaid(req, res) {
        const userId = req.userId;
        const { billId } = req.params;
        const { paymentId } = req.body;
        if (!paymentId) {
            res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'Payment ID is required' },
            });
            return;
        }
        try {
            const bill = await this.billService.markBillPaid(billId, paymentId, userId);
            res.status(200).json({ data: bill });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async importBills(req, res) {
        const userId = req.userId;
        const { source } = req.body;
        try {
            const result = await this.billService.importBills(userId, source);
            res.status(202).json({ data: result });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
    async getRecurringSuggestions(req, res) {
        const userId = req.userId;
        try {
            const suggestions = await this.billService.getRecurringSuggestions(userId);
            res.status(200).json({ data: suggestions });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({
                error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
            });
        }
    }
}
exports.BillController = BillController;
//# sourceMappingURL=bill.controller.js.map