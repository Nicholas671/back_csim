import React, { useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';

function AlbumReviews({ albumId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await fetch(`/api/albums/${albumId}/reviews`);
            const data = await response.json();
            setReviews(data);
        };

        fetchReviews();
    }, [albumId]);

    return (
        <div>
            <h2>Reviews</h2>
            <ul>
                {reviews.map((review, index) => (
                    <li key={index}>
                        {review.review}
                        <ReviewForm albumId={albumId} existingReview={review.review} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AlbumReviews;
