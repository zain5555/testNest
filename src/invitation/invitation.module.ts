import { forwardRef, Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    HelperModule

  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {
}
