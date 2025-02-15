export const prerender = false;

import type { APIContext, APIRoute } from "astro";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from 'zod';

const EMAIL_ADDRESS: string = process.env.EMAIL_ADDRESS || import.meta.env.EMAIL_ADDRESS;
const EMAIL_PASS: string = process.env.EMAIL_PASS || import.meta.env.EMAIL_PASS;
const PERSONAL_EMAIL: string = process.env.PERSONAL_EMAIL || import.meta.env.PERSONAL_EMAIL;

const contactFormSchema = z.object({
    senderName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    senderEmail: z.string().email('Invalid Email Address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 50 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters')
});

export const POST: APIRoute = async ({ request }: APIContext) => {
    try {
        const body = await request.json();
        const validatedBody = contactFormSchema.parse(body);

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            secure: false,
            auth: {
                user: EMAIL_ADDRESS,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        } as SMTPTransport.Options);

        await transport.sendMail({
            from: EMAIL_ADDRESS,
            to: PERSONAL_EMAIL,
            subject: `New Message From: ${validatedBody.senderName}`,
            text: `
            Name: ${validatedBody.senderName}
            Email: ${validatedBody.senderEmail}
            Message: ${validatedBody.message}

            Reply directly to this email to respond to ${validatedBody.senderName}.
          `
        });

        return new Response(
            JSON.stringify({
                message: 'Message sent successfully'
            }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
    } catch (error) {
        console.error('Contact form error:', error);

        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(err => err.message).join(', ');
            return new Response(
                JSON.stringify({
                    message: errorMessage
                }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
        }

        return new Response(
            JSON.stringify({
                message: 'An error occurred while sending your message'
            }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
    }
}