import React, { useEffect, useState } from 'react';
import { getRandomAlbums } from '../spotify';
import FavoriteButton from './FavoriteButton';
import ReviewForm from './ReviewForm';
import AlbumReviews from './AlbumReviews';
import CommentForm from './CommentForm';
import AlbumComments from './AlbumComments';

function RandomAlbums() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        async function fetchRandomAlbums() {
            const albums = await getRandomAlbums();
            setAlbums(albums);
        }
        fetchRandomAlbums();
    }, []);

    return (
        <div>
            <h2>Random Albums</h2>
            <ul>
                {albums.map(album => (
                    <li key={album.id}>
                        <a href={`/album/${album.id}`}>{album.name}</a>
                        <FavoriteButton albumId={album.id} />
                        <ReviewForm albumId={album.id} />
                        <AlbumReviews albumId={album.id} />
                        <CommentForm albumId={album.id} />
                        <AlbumComments albumId={album.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RandomAlbums;
