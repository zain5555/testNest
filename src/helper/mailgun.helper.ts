import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { NodeMailgun } from 'ts-mailgun/ts-mailgun';
import { activationEmail, emailDomain, invitationEmail, numberOfEmailRetries, signUpEmailData } from '../common/constants';
import activateEmailTemplate from '../common/emails/activate.template';
import inviteEmailTemplate from '../common/emails/invite.template';
import signUpEmailTemplate from '../common/emails/signup.template';

@Injectable()
export class MailGunHelper {
  private readonly mailGunClient = null;
  
  constructor(private readonly configService: ConfigService){
    this.mailGunClient = new NodeMailgun();
    this.mailGunClient.apiKey = this.configService.mailGunApiKey;
    this.mailGunClient.domain = emailDomain;
  }
  
  async activateEmail(jwt: string, toEmail: string, name: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {
    
    emailRetries --;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }
    
    this.mailGunClient.fromEmail = activationEmail.FROM;
    this.mailGunClient.fromTitle = activationEmail.TITLE;
    
    this.mailGunClient.init();
    
    const activationLink = `${this.configService.frontendAppUri}/activate/${jwt}`;
    
    this.mailGunClient.send(toEmail, activationEmail.SUBJECT, activateEmailTemplate(name, activationLink)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.activateEmail(jwt, toEmail, name, emailRetries);
    });
  }
  
  async inviteEmail(jwt: string, toEmail: string, name: string, inviteeName: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {
    
    emailRetries --;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }
    
    this.mailGunClient.fromEmail = invitationEmail.FROM;
    this.mailGunClient.fromTitle = invitationEmail.TITLE;
    
    this.mailGunClient.init();
    
    const invitationLink = `${this.configService.frontendAppUri}/invite/${jwt}`;
    
    this.mailGunClient.send(toEmail, invitationEmail.SUBJECT, inviteEmailTemplate(name, inviteeName, invitationLink)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.inviteEmail(jwt, toEmail, name, inviteeName, emailRetries);
    });
  }
  
  async signUpEmail(toEmail: string, name: string, companyName: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {
    
    emailRetries --;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }
    
    this.mailGunClient.fromEmail = signUpEmailData.FROM;
    this.mailGunClient.fromTitle = signUpEmailData.TITLE;
    
    this.mailGunClient.init();
    
    this.mailGunClient.send(toEmail, signUpEmailData.SUBJECT, signUpEmailTemplate(name, toEmail, companyName)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.signUpEmail(toEmail, name, companyName, emailRetries);
    });
  }
}
