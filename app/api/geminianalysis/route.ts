// app/api/geminianalysis/route.ts
import { geminiModel } from '@/lib/gemini';
import { generateObject } from 'ai';
import {  ResponseSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const { imageBase64, notes } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const prompt = `You are an expert UPI spending analyst.
Analyze the attached UPI transaction screenshot carefully.

${notes ? `User notes: ${notes}` : ''}

Extract every transaction visible. Even if merchant name is just a person's name, still include it.
Categorize intelligently (Food, Groceries, Transport, Shopping, Bills, Entertainment, Health, Others, etc.).
Also provide:
- insights (overall analysis)
- suggestions (general advice)
- savingTips (specific actionable ways the user can save money based on this spending)
Return clean JSON only.`;

    const { object } = await generateObject({
      model: geminiModel,
      // ResponseInput is a TypeScript type and not available at runtime.
      // Use a runtime Zod schema (generic any here) to satisfy generateObject.
      schema: ResponseSchema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { 
              type: 'image', 
              image: imageBase64.split(',')[1] || imageBase64 
            },
          ],
        },
      ],
    });

    // Accurate Math Calculation Override
    const calculatedTotal = object.transactions.reduce((sum: number, t: any) => 
      sum + (t.amount || 0), 0
    );

    const calculatedCategories: Record<string, number> = {};
    
    object.transactions.forEach((t: any) => {
      if (t.category && t.amount) {
        calculatedCategories[t.category] = (calculatedCategories[t.category] || 0) + t.amount;
      }
    });

    const finalResponse = {
      ...object,
      summary: {
        totalSpent: calculatedTotal,
        topCategories: calculatedCategories,
      },
    };

    return Response.json(finalResponse);

  } catch (error: any) {
    console.error('Analyze UPI Error:', error);
    return Response.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    );
  }
}