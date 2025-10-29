const express = require("express");
const { PORT } = require('./config');

const cors = require("cors");

const rootRouter = require("./routes/index");
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
}));

app.use(express.json());
app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});



