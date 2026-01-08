import mongoose from "mongoose";

const aiImagesmodelSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String },
  //   Date:{type, Object},
  featureType: { type: String },
  uploadedImages: [{ type: String }], // Array of image URLs
  selectedFeature: [{ type: String }], // Array
  selectedStyle: [{ type: String }], // Array
  beforeAfterData: [{ type: mongoose.Schema.Types.Mixed }], // Array of objects
  finalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});

const project = mongoose.model("aiImagesmodel", aiImagesmodelSchema);
export default project;
