import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

// Import the required types from the protos
type SynthesizeSpeechRequest = protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;

// Initialize the Text-to-Speech client with credentials from environment variables
const client = new TextToSpeechClient({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'),
});

export async function POST(req: Request) {
    try {
        // Extract the text from the request body
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Configure the text-to-speech request with proper typing
        const request: SynthesizeSpeechRequest = {
            input: { text },
            voice: {
                languageCode: 'ko-KR',
                name: 'ko-KR-Wavenet-D', // Male WaveNet voice for better quality
                ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE,
            },
            audioConfig: {
                audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
                speakingRate: 0.85,    // Slightly slower than normal
                pitch: -2.0,           // Lower pitch for clearer male voice
                volumeGainDb: 0.0,     // Normal volume
                effectsProfileId: ['large-home-entertainment-class-device']  // Better audio quality
            },
        };

        // Call the Google Cloud TTS API
        const [synthesizeResponse] = await client.synthesizeSpeech(request);

        // Check if we got audio content back
        if (!synthesizeResponse.audioContent) {
            throw new Error('No audio content received from Google Cloud TTS');
        }

        // Return the audio content with appropriate headers
        return new NextResponse(synthesizeResponse.audioContent, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        // Log the error server-side
        console.error('Text-to-Speech API Error:', error);

        // Determine if it's a known error type
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Generic error response
        return NextResponse.json(
            { error: 'Failed to generate speech' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '16kb', // Limit size of incoming text
        },
    },
};