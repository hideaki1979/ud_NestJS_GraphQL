import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInResponse } from './dto/signInResponse';
import { JwtPayload } from './types/jwtPayload.type';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userService.getUser(email);

		if (user && (await bcrypt.compare(password, user.password))) {
			return user;
		}
		return null;
	}

	signIn(user: User): SignInResponse {
		const payload: JwtPayload = { email: user.email, sub: user.id };
		return { accessToken: this.jwtService.sign(payload), user };
	}
}
