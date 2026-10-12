import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "../client/dist");

await connectToDatabase()

app.use(cors({origin: (process.env.ORIGINS || "").split(",").filter(Boolean), credentials: true}))
app.use(cookieParser())
app.use(express.json())

app.get("/api/health", (req, res)=> res.send("Server is Live!"))
app.use('/api/auth', authRouter)
app.use("/api/projects", projectRouter)

// Serve the built client and fall back to index.html for client-side routes
app.use(express.static(clientDist))
app.get(/^(?!\/api\/).*/, (req, res)=> res.sendFile(path.join(clientDist, "index.html")))

// Centralized error handler 
app.use((err, _req, res, _next)=>{
    console.error(`[Error] ${err.message}`);
    res.status(500).json({error: err.message})
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
