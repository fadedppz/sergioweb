import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert sales assistant for Eclipse Electric, an online store specializing in Surron electric motorcycles and parts. Help customers find the right bike, explain specs, assist with orders, and answer questions about Surron products. Be enthusiastic, knowledgeable, and concise. Keep responses under 150 words.

Key products:
- Surron Light Bee X: $4,299, 6kW motor, 47mph, 40-60mi range, 125lbs
- Surron Storm Bee: $11,999, 22.5kW liquid-cooled, 75mph, 60-80mi range
- Surron Light Bee S: $3,799, street legal variant
- Surron Ultra Bee: $8,499, 12.5kW, 59mph, 50-75mi range
- Surron Storm Bee RS: $13,499, pre-order only

We also sell batteries, controllers, suspension, handguards, helmets, chargers, and accessories.
Free shipping on orders over $500. 1-2 year warranty on all products.`;

// Models to try in order (first working model wins)
const MODELS = [
  'mistralai/mistral-small-2603',
  'google/gemma-4-26b-a4b-it',
  'qwen/qwen3.6-35b-a3b',
];

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.length < 2 || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER') {
      return NextResponse.json({
        reply: "I'm currently running in offline mode. I can still help with basic questions about our Surron bikes and parts! Try asking about pricing, specs, or availability."
      });
    }

    // Try each model until one works
    for (const model of MODELS) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'Eclipse Electric AI Advisor',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`OpenRouter model ${model} failed (${response.status}):`, errorText);
          continue; // Try next model
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        if (reply) {
          return NextResponse.json({ reply });
        }

        console.warn(`Model ${model} returned empty response`);
        continue;
      } catch (modelError) {
        console.warn(`Model ${model} threw error:`, modelError);
        continue;
      }
    }

    // All models failed — return graceful fallback
    return NextResponse.json({
      reply: "I'm temporarily unable to connect to my AI backend, but I can still answer common questions! Try asking about bike models, pricing, specs, shipping, or warranty — I have all that info ready.",
      fallback: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply: "Something went wrong on my end. Please try again or reach out to us at /contact.",
      fallback: true,
    });
  }
}
