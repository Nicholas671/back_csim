import axios from 'axios';

const getAccessToken = async () => {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'client_credentials',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${process.env.REACT_SPOTIFY_CLIENT_ID}:${process.env.REACT_SPOTIFY_CLIENT_SECRET}`)}`,
        },
    });
    return response.data.access_token;
};

export const searchAlbums = async (query) => {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
            q: query,
            type: 'album',
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data.albums.items;
};