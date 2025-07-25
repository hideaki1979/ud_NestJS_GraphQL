import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	try {
		const app = await NestFactory.create(AppModule);
		app.enableCors(); // この行を追加
		app.useGlobalPipes(new ValidationPipe());
		await app.listen(process.env.PORT ?? 3100);

		// Graceful shutdown
		process.on('SIGTERM', () => {
			app.close().catch((error) => {
				console.error('グレースフルシャットダウンでエラー発生：', error);
			});
		});
	} catch (error) {
		console.error('サーバー起動エラー：', error);
		process.exit(1);
	}
}
bootstrap();
