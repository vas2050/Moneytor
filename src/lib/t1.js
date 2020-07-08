const p = require("./parseWeb");

p.xoomPage("india", "CAD", 4999)
.then(() => console.log("done"))
.catch(err => {
  console.log(err);
  process.exit(10);
});
