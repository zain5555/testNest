import { DynamicModule, Global, Module } from '@nestjs/common';
import { StringHelper } from './string.helper';
import { MailGunHelper } from './mailgun.helper';

@Global()
@Module({
  providers: [StringHelper, MailGunHelper],
  exports: [StringHelper, MailGunHelper],
})
export class HelperModule {
  static forRoot(): DynamicModule {
    return {
      module: HelperModule,
      exports: [StringHelper, MailGunHelper],
    };
  }
}
