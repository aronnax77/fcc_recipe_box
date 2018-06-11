
var TitleBar = {
  template: "#logo"
};

var RecipeList = {
  template: "#list",
  props: ["db"]
};

var Recipe = {
  template: "#recipe",
  props: ["db"]
};

// define the routes
var routes = [
  {path: "/", component: RecipeList},
  {path: "/recipe/:id", component: Recipe}
];

var router = new VueRouter({
  routes: routes
});

var main = new Vue({
  el: "#app",
  data: {
    db: myRecipes
  },
  router: router,
  components: {
    logo: TitleBar,
    recipe: Recipe,
    "recipe-list": RecipeList
  }

});
