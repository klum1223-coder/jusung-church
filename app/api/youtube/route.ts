import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');
    const API_KEY = 'AIzaSyA0TME5f5g7ViZ7WpxI1R2qru8rh3_TPZg';

    try {
        let videos = [];

        if (playlistId) {
            const PLAYLIST_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`;
            const response = await fetch(PLAYLIST_API_URL, { next: { revalidate: 300 } });
            const data = await response.json();

            if (data.items) {
                videos = data.items.map((item: any) => ({
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    linkUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    publishedAt: item.snippet.publishedAt,
                    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                    description: item.snippet.description,
                    type: 'sermon'
                }));
            }
        } else {
            const CHANNEL_ID = 'UCbSlsx3Ww8lLF2nvOexteEQ';
            const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

            const response = await fetch(RSS_URL, { next: { revalidate: 300 } });
            const xmlText = await response.text();

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });
            const result = parser.parse(xmlText);

            let entries = result.feed?.entry || [];
            if (!Array.isArray(entries)) {
                entries = [entries];
            }

            videos = entries.map((entry: any) => ({
                id: entry['yt:videoId'],
                title: entry.title,
                linkUrl: `https://www.youtube.com/watch?v=${entry['yt:videoId']}`,
                publishedAt: entry.published,
                thumbnail: entry['media:group']['media:thumbnail']['@_url'],
                description: entry['media:group']['media:description'],
                type: 'youtube'
            }));
        }

        return NextResponse.json(videos);
    } catch (error) {
        console.error('YouTube RSS Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}
