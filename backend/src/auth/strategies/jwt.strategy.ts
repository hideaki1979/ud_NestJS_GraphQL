import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../types/jwtPayload.type';
import { User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
		});
	}

	async validate(payload: JwtPayload): Promise<User | null> {
		return await this.userService.getUser(payload.email);
	}
}
