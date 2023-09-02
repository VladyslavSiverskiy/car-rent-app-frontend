import { useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import './styles/Review.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
import { saveComment } from "./api/CarApiService";


export default function CarComment({carId}) {
    const [rating, setRating] = useState(2);
    const commentTextAreaRef = useRef(null);
    const navigate = useNavigate();
    const auth = useAuth();

    const changeRating = (newRating, name) => {
        setRating(newRating);
        
    };

    const getRating = () => {
        const reviewData = {
            "carId" : carId,
            "userId" : auth.userData.id,
            "description" : commentTextAreaRef.current.value,
            "rate" : rating
        };

        console.log(reviewData);
        saveComment(reviewData).then(resp => {
            window.location.reload();
        }).catch(err => console.log(err));
    }

    return (
        <div className="container">
            <div className="review__comment-field">
                <p className="review__title">Rate this car: </p>
                <StarRatings
                    rating={rating}
                    starRatedColor="rgb(234, 234, 6)"
                    starHoverColor="rgb(203, 203, 21)"
                    changeRating={changeRating}
                    numberOfStars={5}
                    name='rating'
                />
                <div>Enter comment:</div>
                <div className="comment-form">
                    <textarea ref={commentTextAreaRef} className="form-control" id="comments-text-area" rows="3"></textarea>
                </div>
                <button className="btn btn-primary" onClick={getRating}>Save comment</button>
            </div>
        </div>
    );
}