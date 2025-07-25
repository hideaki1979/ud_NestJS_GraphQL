import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignInInput } from '../dto/signin.input';

interface GraphQLContext {
	req?: Request;
	body: SignInInput;
}

interface GraphQLArgs {
	signInInput: SignInInput;
}

export class GqlAuthGuard extends AuthGuard('local') {
	constructor() {
		super();
	}

	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext<GraphQLContext>();
		request.body = ctx.getArgs<GraphQLArgs>().signInInput;

		return request;
	}
}
