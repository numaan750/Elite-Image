import aiImagesmodelSchema from "../models/aiImagesmodels.js";


export const getAllImages = async(req, res) => {
    try {
        const images = await aiImagesmodelSchema.find({ userid: req.userId });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getImageById = async(req, res) => {
    try {
        const image = await aiImagesmodelSchema.findOne({ 
            _id: req.params.id, 
            userid: req.userId 
        });
        if (!image) {
            return res.status(404).json({ message: "Image not found or unauthorized" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const createImages = async(req, res) => {
    try {
        const image = await aiImagesmodelSchema.create({
            ...req.body,
            userid: req.userId
        });
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateImages = async(req, res) => {
    try {
        const image = await aiImagesmodelSchema.findOneAndUpdate(
            { _id: req.params.id, userid: req.userId },
            req.body,
            { new: true }
        );
        if (!image) {
            return res.status(404).json({ message: "Image not found or unauthorized" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteImages = async(req, res) => {
    try {
        const image = await aiImagesmodelSchema.findOneAndDelete({ 
            _id: req.params.id, 
            userid: req.userId 
        });
        if (!image) {
            return res.status(404).json({ message: "Image not found or unauthorized" });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}