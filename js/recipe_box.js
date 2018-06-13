
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

var Editor = {
  template: "#editor"
};

// define the routes
var routes = [
  {path: "/", component: RecipeList},         //RecipeList
  {path: "/recipe/:id", component: Recipe},
  {path: "/editor/new", component: Editor}
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
    "recipe-list": RecipeList,
    new: Editor
  }

});
