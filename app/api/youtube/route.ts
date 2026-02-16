import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyA0TME5f5g7ViZ7WpxI1R2qru8rh3_TPZg';

// 재생목록 정의
const PLAYLISTS = [
    {
        id: 'PLiCiBKlwP2LHA5nPQt7aNn8i4xdZRlHHf',
        label: '주일설교',
        engLabel: 'Sunday Sermon',
        maxResults: 3,
    },
    {
        id: 'PLiCiBKlwP2LGjVXrvD7E7cWG1Axdvqiqf',
        label: '주일설교 Shorts',
        engLabel: 'Sermon Shorts',
        maxResults: 6,
    },
    {
        id: 'PLiCiBKlwP2LF6_v5q7okASEcl02_KpFBD',
        label: '기독교에 관한 질문',
        engLabel: 'Faith Q&A',
        maxResults: 3,
    },
];

async function fetchPlaylist(playlistId: string, maxResults: number) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`;
        const response = await fetch(url, { next: { revalidate: 600 } });
        const data = await response.json();

        if (!data.items) return [];

        return data.items
            .filter((item: any) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
            .map((item: any) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                linkUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                publishedAt: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                description: item.snippet.description,
                type: 'sermon',
            }));
    } catch (error) {
        console.error(`Failed to fetch playlist ${playlistId}:`, error);
        return [];
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');
    const maxResults = parseInt(searchParams.get('maxResults') || '3', 10);

    try {
        if (playlistId) {
            const videos = await fetchPlaylist(playlistId, maxResults);
            return NextResponse.json(videos);
        }

        // 전체: 각 재생목록별 지정된 maxResults 사용
        const results = await Promise.all(
            PLAYLISTS.map(async (pl) => ({
                id: pl.id,
                label: pl.label,
                engLabel: pl.engLabel,
                videos: await fetchPlaylist(pl.id, pl.maxResults),
            }))
        );

        return NextResponse.json(results);
    } catch (error) {
        console.error('YouTube API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}
