const ExpressError = require('./utils/ExpressError');
const Art = require('./models/art');
const Review = require('./models/review');
const {artSchema, reviewSchema} = require('./schema');

module.exports.LoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next();
}

module.exports.checkArtist =  async(req,res,next)=>{
    const {id} = req.params;
    const art = await Art.findById(id);
    console.log(art.artist);
    console.log(req.user);
    if(!art.artist.equals(req.user._id)){
        req.flash('error', 'You DO NOT have permission!!')
        return res.redirect(`/arts/${art._id}`)
    }
    next();
}

module.exports.reviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const art = await Art.findById(id);
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You DO NOT have permission!!')
        return res.redirect(`/arts/${art._id}/reviews`)
    }
    next();
}

module.exports.validateArt = (req, res, next) => {       
    const { error } = artSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
