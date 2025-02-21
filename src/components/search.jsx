import React, { useState } from 'react';
import { searchAlbums } from './spotify';

function Search() {
    const [query, setQuery] = useState('');
    const [albums, setAlbums] = useState([]);

    const handleSearch = async () => {
        const albums = await searchAlbums(query);
        setAlbums(albums);
    };

    return (
        <div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {albums.map(album => (
                    <li key={album.id}>{album.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Search;
