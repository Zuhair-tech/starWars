const Joi = require('joi');

module.exports.artSchema = Joi.object({
    art: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().valid('Sketch','Painting','Other')
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
    }).required()
});