import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if the required environment variables are set
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('Missing Twilio credentials. Please check your environment variables.');
}

// Initialize the Twilio client only if the credentials are available
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: Request) {
  if (!client) {
    return NextResponse.json({ success: false, error: 'Twilio client not initialized' }, { status: 500 });
  }

  const { to, message } = await request.json();

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });

    return NextResponse.json({ success: true, messageId: result.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ success: false, error: 'Failed to send SMS' }, { status: 500 });
  }
}