const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {LoggedIn, checkArtist,validateArt} = require('../middleware');
const arts = require('../controllers/arts')
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(LoggedIn, catchAsync(arts.allArts))
    .post(LoggedIn, upload.array('image'), validateArt, catchAsync(arts.postArt))

router.get('/new',LoggedIn, arts.newArt)

router.route('/:id')
    .get(LoggedIn, catchAsync(arts.showArt))
    .put(LoggedIn,upload.array('image'), checkArtist, catchAsync(arts.editArt))
    .delete(LoggedIn, checkArtist, catchAsync(arts.deleteArt))    

router.get('/:id/edit',LoggedIn, checkArtist, catchAsync(arts.getEditForm))

module.exports = router;




