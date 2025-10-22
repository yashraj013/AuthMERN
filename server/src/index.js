
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import { router } from "./routes/user.routes.js";

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//API ENDPOINTS
app.get('/', (req, res) => {
    res.send("API Working")
})

app.use("/api/auth", router)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on the port: ${port}`)
});
