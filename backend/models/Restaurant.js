import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const CommentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
});

const RestaurantSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
        required: [true, "Insert restaurant name"]
    },
    city_name: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    comments: [CommentSchema],
    tags: [TagSchema],
    hasComments: {
        type: Boolean,
        default: false,
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

export { Restaurant, Comment };
