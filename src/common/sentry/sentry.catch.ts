import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryCatchAllExceptionFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;

    // Log the exception to Sentry
    Sentry.captureException(exception);
    // Send a response to the client
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}