const Art = require('../models/art');
const {cloudinary} = require('../cloudinary');

module.exports.allArts = async(req,res)=>{
    const arts = await Art.find({});
    res.render('arts/index', { arts })
}

module.exports.postArt = async(req,res)=>{
    const art = new Art(req.body.art);
    art.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    art.artist = req.user;
    await art.save();
    console.log(art);
    res.redirect(`/arts/${art._id}`)
}

module.exports.newArt = (req,res)=>{
    res.render('arts/new')
}

module.exports.showArt = async(req,res)=>{
    const {id} = req.params;
    const art = await Art.findById(id).populate('artist');
    res.render('arts/show', {art})
}

module.exports.editArt = async(req,res)=>{
    const {id} = req.params;
    const art = await Art.findByIdAndUpdate(id, {...req.body.art});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    art.images.push = {...imgs};
    await art.save();
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename); 
        }
        await art.updateOne({$pull: {images:{filename:{$in:req.body.deleteImages}}}})
    }
    res.redirect(`/arts/${art._id}`)
}

module.exports.deleteArt = async(req,res)=>{
    await Art.findByIdAndDelete(req.params.id)
    res.redirect('/arts')
}

module.exports.getEditForm = async(req,res)=>{
    const art = await Art.findById(req.params.id);
    res.render('arts/edit', {art})
}









