import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User as UserModel } from './models/user.model';
import { CreateUserInput } from './dto/createUser.input';
import { User } from 'generated/prisma';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/getUser.args';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Mutation(() => UserModel)
	async createUser(
		@Args('createUserInput') createUserInput: CreateUserInput,
	): Promise<User> {
		return await this.userService.createUser(createUserInput);
	}

	@Query(() => UserModel, { nullable: true })
	@UseGuards(JwtAuthGuard)
	async getUser(@Args() getUserArgs: GetUserArgs): Promise<User | null> {
		return await this.userService.getUser(getUserArgs.email);
	}
}
