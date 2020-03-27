import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as jwt from 'jsonwebtoken';
import { defaultJWTSignOptions } from '../common/constants';
import { cloneDeep } from 'lodash';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class StringHelper {
  constructor(private readonly configService: ConfigService){
  }
  
  async generateRandomString(length: number): Promise<string> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  async generateRandomNumber(length: number): Promise<string> {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  async signPayload(payload: any, subject: string): Promise<string> {
    const signOptions: SignOptions = cloneDeep(defaultJWTSignOptions);
    signOptions.subject = subject;
    return jwt.sign(payload, this.configService.jwtSecret, signOptions);
  }
  
  
  async verifyPayload(jwtToken: string): Promise<object | string> {
    return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, this.configService.jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      })
    })
  }
}
