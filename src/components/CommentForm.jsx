import React, { useState } from 'react';

function CommentForm({ albumId }) {
    const [comment, setComment] = useState('');

    const handleAddComment = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ albumId, comment })
        });

        const data = await response.json();
        if (data.error) {
            console.log(data.error);  // Handle error
        } else {
            console.log(data);  // Updated comments list
        }
    };

    return (
        <div>
            <h2>Add a Comment</h2>
            <textarea
                placeholder="Write your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Submit Comment</button>
        </div>
    );
}

export default CommentForm;
