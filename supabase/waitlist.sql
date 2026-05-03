-- Create a waitlist table to store emails for the "Build Yours" feature
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since they are just joining the waitlist)
CREATE POLICY "Allow public inserts" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Create policy to only allow admins to read the waitlist
CREATE POLICY "Allow admins to read" ON public.waitlist
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );
