import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInResponse } from './dto/signInResponse';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/ggl-auth.guard';
import { SignInInput } from './dto/signin.input';
import { User } from 'generated/prisma';

interface AuthContext {
	user: User;
}

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => SignInResponse)
	@UseGuards(GqlAuthGuard)
	async signIn(
		@Args('signInInput') signInInput: SignInInput,
		@Context() context: AuthContext,
	) {
		return await this.authService.signIn(context.user);
	}
}
