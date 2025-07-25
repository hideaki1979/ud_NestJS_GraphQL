import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Status } from 'generated/prisma';

registerEnumType(Status, {
	name: 'Status',
});

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
			}),
			isGlobal: true,
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: process.env.NODE_ENV !== 'production',
			autoSchemaFile: join(process.cwd(), 'src/schema.qql'),
		}),
		TaskModule,
		PrismaModule,
		UserModule,
		AuthModule,
	],
})
export class AppModule {}
