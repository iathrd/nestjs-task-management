import { Controller, Get, Body, ValidationPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredencialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get('/signup')
    signUp(@Body(ValidationPipe) authCredencialsDto: AuthCredencialsDto): Promise<void> {
        return this.authService.signUp(authCredencialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredencialsDto: AuthCredencialsDto): Promise<{ accesToken: string }> {
        return this.authService.signIn(authCredencialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req);
    }
}
