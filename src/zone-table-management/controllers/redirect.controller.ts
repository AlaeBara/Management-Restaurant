import { Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/user-management/decorators/auth.decorator';
import { RedirectService } from '../services/redirect.service';

@Controller('api/redirect')
export class RedirectController {

    constructor(private readonly redirectService: RedirectService) { }

    @Get('/generate/menu/table/:id')
    @Public()
    @ApiOperation({ summary: 'Redirect to the menu page' })
    async redirectToMenu(@Param('id') id: string, @Res() res: Response) {
        return res.redirect(this.redirectService.getMenuUrl(id));
    }

}