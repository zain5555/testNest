import { forwardRef, Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {
}
