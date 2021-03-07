const Review = require('../models/review');
const Art = require('../models/art');

module.exports.getReviews = async(req,res)=>{
    const art = await Art.findById(req.params.id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    res.render('reviewPage', {art});
}

module.exports.postReview = async(req,res)=>{
    const art = await Art.findById(req.params.id);
    const review = new Review(req.body.review) ;
    review.author = req.user._id;
    await review.save();
    art.reviews.push(review)
    await art.save()
    res.redirect(`/arts/${art._id}/reviews`)
}

module.exports.deleteReview = async(req,res)=>{
    const { id, reviewId } = req.params;
    const art = await Art.findById(id);
    await Art.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/arts/${art._id}/reviews`);
}