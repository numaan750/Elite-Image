import mongoose from "mongoose";

const aiImagesmodelSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
//   Date:{type, Object},
  featureType: { type: String },
  uploadedImages: { type: Array },
  selectedFeature: { type: Array },
  selectedStyle: { type: Array },
  beforeAfterData: { type: Array },
  finalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});

const project = mongoose.model("aiImagesmodel", aiImagesmodelSchema);
export default project;
