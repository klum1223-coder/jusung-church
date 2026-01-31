import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rssUrl = 'https://rss.blog.naver.com/joosung0416.xml';
        const response = await fetch(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // 1시간마다 캐시 갱신
        });

        if (!response.ok) throw new Error('Failed to fetch RSS');

        const xmlText = await response.text();

        // RSS 아이템 파싱 (Regex 활용)
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xmlText)) !== null && items.length < 6) {
            const content = match[1];

            // CDATA 및 일반 태그 대응
            const titleMatch = content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || content.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = content.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/) || content.match(/<link>([\s\S]*?)<\/link>/);
            const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const descMatch = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || content.match(/<description>([\s\S]*?)<\/description>/);

            if (titleMatch && linkMatch) {
                const rawLink = linkMatch[1].trim();
                const link = rawLink.startsWith('http') ? rawLink : `https://blog.naver.com${rawLink.startsWith('/') ? '' : '/'}${rawLink}`;
                items.push({
                    id: link,
                    title: titleMatch[1].trim(),
                    link: link,
                    pubDate: dateMatch ? dateMatch[1].trim() : "",
                    description: descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim().slice(0, 120) + '...' : ""
                });
            }
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error('Naver RSS Error:', error);
        return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
    }
}
