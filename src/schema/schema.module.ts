import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { CompanySchema } from './company.schema';
import { InvitationSchema } from './invitation.schema';

const schemaArray = [
  MongooseModule.forFeature([
    {
      name: 'User',
      schema: UserSchema,
      collection: 'users',
    },
    {
      name: 'Company',
      schema: CompanySchema,
      collection: 'companies',
    },
    {
      name: 'Invitation',
      schema: InvitationSchema,
      collection: 'invitations',
    },
  ]),
];

@Global()
@Module({
  imports: schemaArray,
  exports: schemaArray,
})
export class SchemaModule {
  static forRoot(): DynamicModule {
    return {
      module: SchemaModule,
      exports: schemaArray,
    };
  }
}
