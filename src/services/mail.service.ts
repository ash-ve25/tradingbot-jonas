import { FROM_ADDRESS, SENDGRIDAPIKEY } from '@/config';
import { MailService } from '@sendgrid/mail';

class mailService {
  mail = new MailService();
  constructor() {
    this.mail.setApiKey(SENDGRIDAPIKEY);
  }
  public async sendMail(to: string, subject: string, text: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let msg = {
          to: to, // Change to your recipient
          from: FROM_ADDRESS, // Change to your verified sender
          subject: subject,
          text: text,
        };
        const data = await this.mail.send(msg);
        resolve(data);
      } catch (error) {
        console.log(error);
        resolve(error);
      }
    });
  }
}

export default mailService;
