import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) { }

    @Post('/signup')
    @HttpCode(201)
    @HttpCode(400)
    @HttpCode(409)
    public async signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
        return await this._authService.signUp(dto);
    }

    @Post('/signin')
    @HttpCode(200)
    @HttpCode(401)
    public async signIn(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string; }> {
        return await this._authService.signIn(dto);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // public async testMethod(@Req() req): Promise<void> {
    //     console.log('REQ', req);
    // }
}
