import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/createUser.input';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(createUserInput: CreateUserInput): Promise<User> {
		const { name, email, password } = createUserInput;
		const saltRounds = process.env.BCRYPT_SALT_ROUNDS
			? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
			: 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		return await this.prismaService.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}

	async getUser(email: string): Promise<User | null> {
		return await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
	}
}
