import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { SchemaModule } from './schema/schema.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { InvitationModule } from './invitation/invitation.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.mongoUri,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
    }),
    SchemaModule.forRoot(),
    HelperModule.forRoot(),
    UserModule,
    AuthModule,
    CompanyModule,
    InvitationModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
