import { Module } from '@nestjs/common';
import { TouchdownController } from './touchdown.controller';
import { TouchdownService } from './touchdown.service';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [UserModule, CompanyModule],
  controllers: [TouchdownController],
  providers: [TouchdownService],
})
export class TouchdownModule {
}
