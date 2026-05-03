import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client (so we can bypass RLS if needed, though public insert is enabled)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      // Handle unique violation (email already registered)
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Email is already on the waitlist' },
          { status: 200 } // Return 200 so the UI can show a friendly message
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: 'Successfully joined the waitlist' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
