import express from "express";

import blogpostSchema from "./shema.js";


const router = express.Router();




router.get("/", (req, res) => {
    res.send("Hello from blogspots");
});




export default router