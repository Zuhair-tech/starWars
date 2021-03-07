const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/reviews')
const {LoggedIn, reviewAuthor,validateReview} = require('../middleware');

router.route('/')
    .get(LoggedIn, catchAsync(review.getReviews))
    .post(LoggedIn, validateReview, catchAsync(review.postReview))

router.route('/:reviewId')
    .delete(LoggedIn,reviewAuthor, catchAsync(review.deleteReview))

module.exports = router;