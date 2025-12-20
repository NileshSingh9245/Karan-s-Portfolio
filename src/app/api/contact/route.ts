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
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        to: "kdkaranwork@gmail.com,nileshkumarsingh@zohomail.in",
        from_name: body.name,
        subject: `New ${body.service} Inquiry - ${body.budget}`,
        name: body.name,
        email: body.email,
        phone: body.phone,
        service: body.service,
        budget: body.budget,
        message: body.message,
      }),
    });

    const data = await response.json();
    
    console.log('Web3Forms response:', { status: response.status, data });

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
