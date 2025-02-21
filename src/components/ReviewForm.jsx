import React, { useState } from 'react';

function ReviewForm({ albumId, existingReview }) {
    const [review, setReview] = useState(existingReview || '');

    const handleAddReview = async () => {
        const token = localStorage.getItem('token');
        const method = existingReview ? 'PUT' : 'POST';
        const url = '/api/reviews';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ albumId, review })
        });

        const data = await response.json();
        if (data.error) {
            console.log(data.error);  // Handle error
        } else {
            console.log(data);  // Updated reviews list
        }
    };

    const handleDeleteReview = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/reviews', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ albumId })
        });

        const data = await response.json();
        if (data.error) {
            console.log(data.error);  // Handle error
        } else {
            console.log(data);  // Updated reviews list
            setReview('');
        }
    };

    return (
        <div>
            <h2>{existingReview ? 'Update' : 'Add'} a Review</h2>
            <textarea
                placeholder="Write your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <button onClick={handleAddReview}>{existingReview ? 'Update' : 'Submit'} Review</button>
            {existingReview && <button onClick={handleDeleteReview}>Delete Review</button>}
        </div>
    );
}

export default ReviewForm;
