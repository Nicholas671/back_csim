import React, { useState } from 'react';
import { searchAlbums } from '../services/spotify.js';

const Search = () => {
    const [query, setQuery] = useState('');
    const [albums, setAlbums] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const results = await searchAlbums(query);
        setAlbums(results);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for an album..."
                />
                <button type="submit">Search</button>
            </form>
            <div>
                {albums.map((album) => (
                    <div key={album.id}>
                        <h3>{album.name}</h3>
                        <p>{album.artists[0].name}</p>
                        <img src={album.images[0].url} alt={album.name} width="100" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
