/* import {
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
  } */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof QueryFailedError || 
          exception instanceof EntityNotFoundError || 
          exception instanceof CannotCreateEntityIdMapError)) {
      return; // Do nothing if the exception is not one of the specified types
    }
  
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
  
    let status: number;
    let message: string;
    let error: string;
  
    if (exception instanceof QueryFailedError) {
      status = HttpStatus.CONFLICT;
      message = this.getConstraintViolationMessage(exception);
      error = 'Data Conflict';
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
      error = 'Not Found';
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Cannot create entity ID map';
      error = 'Bad Request';
    } else {
      return; // Do nothing for other exceptions
    }
  
    const responseBody = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      //path: request.url,
    };
  
    response.status(status);
    response.send(responseBody);
  }

  private getConstraintViolationMessage(exception: QueryFailedError): string {
    const detail = (exception.driverError as any)?.detail;
    if (detail) {
      // Extract column name from the detail message
      const match = detail.match(/Key \((.+?)\)=/);
      if (match && match[1]) {
        const column = match[1];
        return `The value for '${column}' already exists`;
      }
    }

    const constraintName = (exception.driverError as any)?.constraint;
    if (constraintName) {
      // Extract the field name from the constraint name
      const field = constraintName.split('_')[1]; // Assumes constraint names follow a pattern like 'UQ_username'
      return `A record with this ${field} already exists`;
    }

    return 'Unique constraint violation';
  }
}
