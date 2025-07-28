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
			// dueDateを適切なDateTime形式に変換(PrismaでISO-8601 DateTime形式のため)
			const parseDueDate = new Date(dueDate);
			if (isNaN(parseDueDate.getTime())) {
				throw new Error('無効な日付データです');
			}

			return await this.prismaService.task.create({
				data: {
					name,
					dueDate: parseDueDate,
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
			throw new Error('更新対象のタスクのユーザーIDが見つかりませんでした');
		}

		// dueDateを適切なDateTime形式に変換(PrismaでISO-8601 DateTime形式のため)
		const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
		if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
			throw new Error('無効な日付データです');
		}

		return await this.prismaService.task.update({
			data: {
				name,
				dueDate: parsedDueDate,
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
