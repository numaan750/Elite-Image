import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"
import loginUser from "./routers/loginUser.js"
import aiImagesroutes from "./routers/aiImagesroutes.js"
import paymentroutes from "./routers/paymentrout.js"
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

connectDB();

app.use("/api", loginUser);

app.use("/api", aiImagesroutes);


app.use("/api", paymentroutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app
