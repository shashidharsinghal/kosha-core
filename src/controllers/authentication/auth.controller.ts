import { Request, Response } from 'express';
import { AuthService } from '../../services/authentication/auth.service';
import { ApiResponse } from '../../types/common';
import { AuthRequest } from '../../middleware/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const user = await this.authService.register(email, password, name);
      res.status(201).json({ data: user } as ApiResponse<typeof user>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const result = await this.authService.login(email, password);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const result = await this.authService.refresh(refreshToken);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Refresh token is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const result = await this.authService.logout(refreshToken);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }

  async linkGmail(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { oauthCode } = req.body;

    if (!oauthCode) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'OAuth code is required' },
      } as ApiResponse<never>);
      return;
    }

    try {
      const result = await this.authService.linkGmail(userId, oauthCode);
      res.status(200).json({ data: result } as ApiResponse<typeof result>);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      } as ApiResponse<never>);
    }
  }
}

