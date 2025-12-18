import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a readable stream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer);
        controller.close();
      },
    });

    // Send to OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], file.name, { type: file.type }),
      model: 'whisper-1',
    });

    const text = transcription.text;

    // Summarize with GPT
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Summarize the following transcription in a concise paragraph.' },
        { role: 'user', content: text },
      ],
    });

    const summary = summaryResponse.choices[0].message.content || '';

    // Analyze with GPT
    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Analyze the following transcription: provide key points, sentiment analysis, and any notable insights.' },
        { role: 'user', content: text },
      ],
    });

    const analysis = analysisResponse.choices[0].message.content || '';

    return NextResponse.json({ transcription: text, summary, analysis });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}