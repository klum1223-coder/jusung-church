import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const url = body.url;

        if (!url) {
            return NextResponse.json({ error: 'URL required in body' }, { status: 400 });
        }

        console.log('Fetching QT content from:', url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Fetch failed:', response.status, response.statusText);
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const text = await response.text();

        return new NextResponse(text, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
