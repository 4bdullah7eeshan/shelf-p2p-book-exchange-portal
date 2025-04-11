const { PORT, NODE_ENV } = require("./config/index");
const app = require("./app");

if (NODE_ENV != "test") {
    app.listen(PORT, () => {
        console.log(`Express app running on PORT: ${PORT}!`);
    });
}