const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url : String,
    filename : String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});

const artSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type : Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    category : {
        type: String,
        enum: ['Sketch','Painting','Other']
    },
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    images : [imageSchema]
})

artSchema.post('finOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Art', artSchema);