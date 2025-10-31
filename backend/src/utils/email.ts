import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const loadTemplate = (templateName: string, data: Record<string, any>): string => {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key]);
  });
  
  return template;
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}) => {
  const html = loadTemplate(options.template, options.data);
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html,
  });
};