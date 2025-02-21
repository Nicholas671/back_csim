import React, { useEffect, useState } from 'react';

function AlbumComments({ albumId }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(`/api/albums/${albumId}/comments`);
            const data = await response.json();
            setComments(data);
        };

        fetchComments();
    }, [albumId]);

    return (
        <div>
            <h2>Comments</h2>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        {comment.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AlbumComments;
