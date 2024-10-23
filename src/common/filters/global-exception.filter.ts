import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { Prisma } from '@prisma/client';
  
  @Catch(Prisma.PrismaClientKnownRequestError)
  export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
  
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Database error';
  
      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          break;
        // Add more Prisma error codes as needed
        default:
          // Handle other Prisma errors
          break;
      }
  
      const responseBody = {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
  }