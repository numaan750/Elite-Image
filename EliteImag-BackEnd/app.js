import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"
import loginUser from "./routers/loginUser.js"
import aiImagesroutes from "./routers/aiImagesroutes.js"
import paymentroutes from "./routers/paymentrout.js"
import aiProcessingRoutes from "./routers/aiProcessingRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

connectDB();

app.use("/api", loginUser);

app.use("/api", aiImagesroutes);


app.use("/api", paymentroutes);
app.use("/api", aiProcessingRoutes);




// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

export default app
