import { Inject, Injectable } from "@nestjs/common";
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_user'),
        pass: this.configService.get('nodemailer_pass'),
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('nodemailer_name'),
        address: this.configService.get('nodemailer_user'),
      },
      to,
      subject,
      html,
    });
  }
}
