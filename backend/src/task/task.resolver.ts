import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task as TaskModel } from './models/task.model';
import { CreateTaskInput } from './dto/createTask.input';
import { Task, User } from 'generated/prisma';
import { UpdateTaskInput } from './dto/updateTask.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// GraphQLコンテキストの型定義
interface GraphQLContext {
	req: {
		user: User;
	};
}
@Resolver()
export class TaskResolver {
	constructor(private readonly taskService: TaskService) {}

	@Query(() => [TaskModel], { nullable: 'items' })
	@UseGuards(JwtAuthGuard)
	async getTasks(@Context() context: GraphQLContext): Promise<Task[]> {
		const createUser: User = context.req.user;
		return await this.taskService.getTasks(createUser.id);
	}

	@Mutation(() => TaskModel)
	@UseGuards(JwtAuthGuard)
	async createTask(
		@Args('createTaskInput') createTaskInput: CreateTaskInput,
	): Promise<Task> {
		return await this.taskService.createTask(createTaskInput);
	}

	@Mutation(() => TaskModel)
	@UseGuards(JwtAuthGuard)
	async updateTask(
		@Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
	): Promise<Task> {
		return await this.taskService.updateTask(updateTaskInput);
	}

	@Mutation(() => TaskModel)
	@UseGuards(JwtAuthGuard)
	async deleteTask(
		@Args('id', { type: () => Int }) id: number,
		@Context() context: GraphQLContext,
	): Promise<Task> {
		const user: User = context.req.user;
		return await this.taskService.deleteTask(id, user.id);
	}
}
