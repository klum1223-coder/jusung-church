const API_KEY = 'AIzaSyA0TME5f5g7ViZ7WpxI1R2qru8rh3_TPZg';
const CHANNEL_ID = 'UCbSlsx3Ww8lLF2nvOexteEQ';

async function getPlaylists() {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) {
            console.log("Playlists found:");
            data.items.forEach(item => {
                console.log(`- Title: ${item.snippet.title}, ID: ${item.id}`);
            });
        } else {
            console.log("No playlists found or error:", data);
        }
    } catch (e) {
        console.error("Error fetching playlists:", e);
    }
}

getPlaylists();
