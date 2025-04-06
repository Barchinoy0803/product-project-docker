import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private jwt: JwtService) { }
    canActivate(context: ExecutionContext): boolean {
        let request: Request = context.switchToHttp().getRequest();
        let { token } = request.body;
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            let data = this.jwt.verify(token, { secret: process.env.REFRESH_KEY });
            request['user'] = data;
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
