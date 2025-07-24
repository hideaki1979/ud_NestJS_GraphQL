import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name);
	async onModuleInit() {
		try {
			await this.$connect();
			this.logger.log('データベース接続に成功しました');
		} catch (error) {
			this.logger.error('データベース接続に失敗しました', error);
			throw error;
		}
	}
}
