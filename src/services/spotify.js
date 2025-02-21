async function searchAlbums(query) {
    const response = await fetch('/api/spotify/token');
    const data = await response.json();
    const accessToken = data.access_token;

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const searchData = await searchResponse.json();
    return searchData.albums.items;
}

async function getRandomAlbums() {
    const response = await fetch('/api/spotify/random-albums');
    const albums = await response.json();
    return albums;
}

export { searchAlbums, getRandomAlbums };

