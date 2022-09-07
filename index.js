const app = require("./server");

app.listen(process.env.PORT ?? 3000, () => {
  console.log("App listening on port 3000!");
});
