import { NextResponse } from 'next/server';
import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

async function sendEmailNotification(addressee: string, emalSubject: string, emalText:string) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.NEXT_MAILGUN_API_KEY || "API_KEY",
    // Para dominios de la UE, especifica el endpoint: url: "https://api.eu.mailgun.net"
  });

  const data = await mg.messages.create("sandbox7a10387ae554432ca8215e5f706efa72.mailgun.org", {
    from: "Mailgun Sandbox <postmaster@sandbox7a10387ae554432ca8215e5f706efa72.mailgun.org>",
    to: ["Usuario <dandavarteaga@gmail.com>"],
    subject: "Hola usuario",
    text: "Felicidades, has iniciado sesión en tu cuenta del sistema de contrataciones de Grupo Pissa",
  });

  return data;
}


export async function POST(request: Request) {
    try {
      const { addressee, subject, text } = await request.json(); // Leer el cuerpo de la solicitud
  
      const data = await sendEmailNotification(addressee, subject, text);
      return NextResponse.json({ message: 'Email sent successfully', data });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  }