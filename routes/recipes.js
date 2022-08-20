var recipes = require("../recipes.json");
var router = require("express").Router();

router.get("/", async function (req, res) {
  await res.status(200).json(recipes);
});

router.get("/shopping-list", async function (req, res) {
  if (req.query.ids) {
    const id = req.query.ids.split(",");
    let unmatchedRecipes = [];
    let shopping_list = [];
    var promise = new Promise(function (resolve, reject) {
      if (id.length == 0) {
        resolve([]);
      }
      for (let i = 0; i < id.length; i++) {
        let recipe = recipes.find(function (recipe) {
          return recipe.id == id[i];
        });
        if (recipe) {
          recipe.ingredients.forEach((element) => {
            shopping_list.push(element);
          });
          resolve(shopping_list);
        } else {
          unmatchedRecipes.push(id[i]);
          reject(unmatchedRecipes);
        }
      }
    });
    promise
      .then(function (result) {
        console.log("Resolve", result);
        if (shopping_list.length > 0) {
          res.status(200).json(result);
        }
      })
      .catch(function (error) {
        console.log("Rejected", error);
        res.status(404).send("NOT_FOUND");
      });
  } else {
    await res.status(400).send("No id provided");
  }
});

module.exports = router;
