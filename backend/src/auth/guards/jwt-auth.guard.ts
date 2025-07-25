import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface GraphQLContext {
	req: Request;
}

export class JwtAuthGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext<GraphQLContext>().req;
	}
}
