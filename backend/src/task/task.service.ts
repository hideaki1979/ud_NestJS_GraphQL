import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/createTask.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from 'generated/prisma';
import { UpdateTaskInput } from './dto/updateTask.input';

@Injectable()
export class TaskService {
	constructor(private readonly prismaService: PrismaService) {}

	async getTasks(userId: number): Promise<Task[]> {
		return await this.prismaService.task.findMany({
			where: {
				userId,
			},
		});
	}

	async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
		const { name, dueDate, description, userId } = createTaskInput;
		try {
			return await this.prismaService.task.create({
				data: {
					name,
					dueDate,
					description,
					userId,
				},
			});
		} catch (error) {
			throw new Error(`タスク追加処理が失敗しました： ${error}`);
		}
	}

	async updateTask(updateTaskInput: UpdateTaskInput): Promise<Task> {
		const { id, name, dueDate, status, description } = updateTaskInput;

		// 認可チェック
		const existingTask = await this.prismaService.task.findUnique({
			where: { id },
			select: { userId: true },
		});

		if (!existingTask) {
			throw new Error('ログイン者でないタスクを更新しようとしています');
		}

		return await this.prismaService.task.update({
			data: {
				name,
				dueDate,
				status,
				description,
			},
			where: {
				id,
			},
		});
	}

	async deleteTask(id: number, userId: number): Promise<Task> {
		// 認可チェック
		const task = await this.prismaService.task.findFirst({
			where: {
				id,
				userId,
			},
		});

		if (!task) {
			throw new Error('所有対象のタスクでは無いため削除出来ません');
		}

		return await this.prismaService.task.delete({
			where: {
				id,
			},
		});
	}
}
