import React from 'react';

function FavoriteButton({ albumId }) {
    const handleAddToFavorites = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ albumId })
        });

        const data = await response.json();
        console.log(data);  // Updated favorites list
    };

    return (
        <button onClick={handleAddToFavorites}>Add to Favorites</button>
    );
}

export default FavoriteButton;
