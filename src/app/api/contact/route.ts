import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.message) {
      console.error('Missing fields:', body);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      console.error('WEB3FORMS_ACCESS_KEY not set in environment');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        email: body.email,
        name: body.name,
        phone: body.phone,
        message: `Service: ${body.service}\nBudget: ${body.budget}\n\n${body.message}`,
        subject: `New ${body.service} Inquiry - ${body.budget}`,
        from_name: body.name,
        replyto: body.email,
      }),
    });

    const responseText = await response.text();
    console.log('Web3Forms raw response:', { status: response.status, body: responseText });
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from email service', details: responseText.substring(0, 200) },
        { status: 500 }
      );
    }
    
    console.log('Web3Forms parsed response:', data);

    if (response.ok && data.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      console.error('Web3Forms error:', data);
      return NextResponse.json(
        { error: 'Failed to send email', details: data.message || data },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
