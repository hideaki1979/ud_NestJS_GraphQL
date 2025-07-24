import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		UserModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		ConfigModule.forRoot(),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const secret = configService.get<string>('JWT_SECRET');
				if (!secret) {
					throw new Error('JWT_SECRETの環境変数が設定されてません');
				}

				return {
					secret,
					signOptions: { expiresIn: '1h' },
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
