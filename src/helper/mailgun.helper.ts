import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { NodeMailgun } from 'ts-mailgun/ts-mailgun';
import {
  activationEmail,
  emailDomain, forgotPasswordEmailData,
  invitationEmail,
  newFeedbackEmailData,
  newTouchdownEmailData,
  numberOfEmailRetries,
  signUpEmailData,
} from '../common/constants';
import activateEmailTemplate from '../common/emails/activate.template';
import inviteEmailTemplate from '../common/emails/invite.template';
import signUpEmailTemplate from '../common/emails/signup.template';
import signUpEmailForBrokerTemplate from '../common/emails/signupBroker.template';
import newTouchdownEmailTemplate from '../common/emails/new-touchdown.template';
import newFeedbackEmailTemplate from '../common/emails/new-feedback.template';
import forgotPasswordEmailTemplate from '../common/emails/forgot-password.template';

@Injectable()
export class MailGunHelper {
  private readonly mailGunClient = null;

  constructor(private readonly configService: ConfigService) {
    this.mailGunClient = new NodeMailgun();
    this.mailGunClient.apiKey = this.configService.mailGunApiKey;
    this.mailGunClient.domain = emailDomain;
  }

  async activateEmail(jwt: string, toEmail: string, name: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {

    emailRetries--;
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

    emailRetries--;
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

    emailRetries--;
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

  async signUpEmailForBroker(toEmail: string, name: string, password: string, companyName: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {

    emailRetries--;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }

    this.mailGunClient.fromEmail = signUpEmailData.FROM;
    this.mailGunClient.fromTitle = signUpEmailData.TITLE;

    this.mailGunClient.init();

    this.mailGunClient.send(toEmail, signUpEmailData.SUBJECT, signUpEmailForBrokerTemplate(name, toEmail, password, companyName)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.signUpEmailForBroker(toEmail, name, password, companyName, emailRetries);
    });
  }

  async newTouchdownEmail(toEmail: string, receiverName: string, touchdownCreator: string, touchdownId: string, companyName: string, companyId: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {

    emailRetries--;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }

    this.mailGunClient.fromEmail = newTouchdownEmailData.FROM;
    this.mailGunClient.fromTitle = newTouchdownEmailData.TITLE;

    this.mailGunClient.init();

    const touchdownLink = `${this.configService.frontendAppUri}/touchdown/${companyId}/${touchdownId}`;

    this.mailGunClient.send(toEmail, newTouchdownEmailData.SUBJECT, newTouchdownEmailTemplate(receiverName, touchdownCreator, companyName, touchdownLink)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.newTouchdownEmail(toEmail, receiverName, touchdownCreator, touchdownId, companyName, companyId, emailRetries);
    });
  }

  async newFeedbackEmail(toEmail: string, receiverName: string, touchdownId: string, companyName: string, companyId: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {

    emailRetries--;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }

    this.mailGunClient.fromEmail = newFeedbackEmailData.FROM;
    this.mailGunClient.fromTitle = newFeedbackEmailData.TITLE;

    this.mailGunClient.init();

    const touchdownLink = `${this.configService.frontendAppUri}/touchdown/${companyId}/${touchdownId}`;

    this.mailGunClient.send(toEmail, newFeedbackEmailData.SUBJECT, newFeedbackEmailTemplate(receiverName, companyName, touchdownLink)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.newFeedbackEmail(toEmail, receiverName, touchdownId, companyName, companyId, emailRetries);
    });
  }

  async forgotPasswordEmail(jwt: string, toEmail: string, name: string, emailRetries: number = numberOfEmailRetries): Promise<boolean> {

    emailRetries--;
    if (emailRetries <= 0) {
      return Promise.resolve(false);
    }

    this.mailGunClient.fromEmail = forgotPasswordEmailData.FROM;
    this.mailGunClient.fromTitle = forgotPasswordEmailData.TITLE;

    this.mailGunClient.init();

    const resetPasswordLink = `${this.configService.frontendAppUri}/reset/${jwt}`;

    this.mailGunClient.send(toEmail, forgotPasswordEmailData.SUBJECT, forgotPasswordEmailTemplate(name, resetPasswordLink)).then((response) => {
      return Promise.resolve(true);
    }).catch(async (e) => {
      console.warn(e);
      await this.forgotPasswordEmail(jwt, toEmail, name, emailRetries);
    });
  }
}
