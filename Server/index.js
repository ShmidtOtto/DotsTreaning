const express = require("express");
const app = express();

app.get("/", function(request, response){
  response.json({
    sucess: true,
    message: " Все работает"
  });
});
app.listen(3000);
