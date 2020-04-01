import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CompanyModule } from '../company/company.module';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    forwardRef(() => InvitationModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
