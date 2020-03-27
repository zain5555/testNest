import { DynamicModule, Global, Module } from '@nestjs/common';
import { StringHelper } from './string.helper';

@Global()
@Module({
  providers: [StringHelper],
  exports: [StringHelper],
})
export class HelperModule {
  static forRoot(): DynamicModule {
    return {
      module: HelperModule,
      exports: [StringHelper],
    };
  }
}
