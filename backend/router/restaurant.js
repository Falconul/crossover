import express from "express";
import { Restaurant, Comment } from "../models/restaurant.js";
const restaurantRouter = express.Router();



restaurantRouter.post("/restaurants", async (req, res) => {
    try {
        const restaurantData = req.body;
        const newRestaurant = await Restaurant.create(restaurantData);

        // Check if comments are provided and update hasComments accordingly
        if (restaurantData.comments && restaurantData.comments.length > 0) {
            newRestaurant.hasComments = true;
            await newRestaurant.save();

            // Save each comment separately and associate it with the restaurant
            for (const comment of restaurantData.comments) {
                await Comment.create({
                    ...comment,
                    restaurant: newRestaurant._id
                });
            }
        }

        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
restaurantRouter.post("/comments", async (req, res) => {
    try {
        const { restaurantId, commentData } = req.body;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Create a new comment and associate it with the restaurant
        const newComment = await Comment.create({
            ...commentData,
            restaurant: restaurant._id
        });

        // Update the restaurant to indicate it has comments
        restaurant.hasComments = true;
        await restaurant.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

restaurantRouter.get("/restaurants", async (req, res) => {
    try{
        const response = await Restaurant.find();
        res.status(200).json(response);
    } catch (err){
        res.status(401).json({error: err.message})
    }
})
restaurantRouter.get("/restaurants/:_id", async (req, res) => {
    const { _id } = req.params;

    try {
        const restaurant = await Restaurant.findOne({ _id });

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        if (restaurant.hasComments) {
            // Retrieve comments associated with this restaurant
            const comments = await Comment.find({ restaurant: _id });
            res.status(200).json({ restaurant, comments });
        } else {
            res.status(200).json({ restaurant });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

restaurantRouter.get("/restaurants/:restaurantId/comments", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Retrieve comments associated with the restaurant
        const comments = await Comment.find({ restaurant: restaurant._id });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
restaurantRouter.get("/tags", async (req, res) => {
    try {
        // Retrieve all unique tags from all restaurants
        const allTags = await Restaurant.distinct("tags.name");

        res.status(200).json(allTags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

restaurantRouter.get("/restaurants/:restaurantId/tags", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Retrieve tags associated with the restaurant
        const tags = restaurant.tags;

        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

restaurantRouter.get("/city", async (req, res) => {
    try {
        // Retrieve all unique city names from all restaurants
        const allCities = await Restaurant.distinct("city_name");

        res.status(200).json(allCities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
restaurantRouter.get("/restaurants/:restaurantId/city", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Retrieve the city from the restaurant
        const city = restaurant.city_name;

        res.status(200).json({ city });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
restaurantRouter.get("/img-url", async (req, res) => {
    try {
        // Retrieve all unique image URLs from all restaurants
        const allImgUrls = await Restaurant.distinct("img_url");

        res.status(200).json(allImgUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


restaurantRouter.get("/restaurants/:restaurantId/img-url", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Retrieve the image URL from the restaurant
        const imgUrl = restaurant.img_url;

        res.status(200).json({ imgUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

restaurantRouter.delete("/restaurants/:id", async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const result = await Restaurant.findByIdAndRemove(restaurantId);

        if (!result) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default restaurantRouter;