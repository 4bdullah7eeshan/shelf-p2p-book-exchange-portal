const express = require("express");
const cors = require("cors");

// Import routers here
const {
    sessionRouter,
    userRouter,
    bookRouter,
} = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Use routes here
app.use("/v1/sessions", sessionRouter);
app.use("/v1/users", userRouter);
app.use("/v1/books", bookRouter);

app.use((err, req, res, next) => {
    console.error(err);
    
    res.status(err.statusCode || 500).json({
        "errorCode": err.statusCode || 500,
        "errorMessage": err.message,
    });
});

module.exports = app;