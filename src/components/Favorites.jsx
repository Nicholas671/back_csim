import React, { useEffect, useState } from 'react';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            setFavorites(data);
        };

        fetchFavorites();
    }, []);

    return (
        <div>
            <h2>Your Favorites</h2>
            <ul>
                {favorites.map(albumId => (
                    <li key={albumId}>{albumId}</li>
                ))}
            </ul>
        </div>
    );
}

export default Favorites;
