import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/common';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    const response: ApiResponse<never> = {
      error: {
        code: err.code,
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.details : undefined,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unexpected errors
  console.error('Unexpected error:', err);
  const response: ApiResponse<never> = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  };
  res.status(500).json(response);
}

