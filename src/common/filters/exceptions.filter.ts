import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { success: false, message: 'Internal server error' };

    if (exception instanceof Error && exception.message === 'Permission not found') {
      response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: exception.message,
      });
    } else {
      response.status(status).json({
        success: false,
        message: message,
      });
    }
  }
}