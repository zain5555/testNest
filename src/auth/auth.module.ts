import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { RegisterStrategy } from './register.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CompanyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RegisterStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {
}
