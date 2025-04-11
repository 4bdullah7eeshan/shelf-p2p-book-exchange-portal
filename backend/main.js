const app = require("./app");

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express app running on PORT: ${PORT}!`);
});
