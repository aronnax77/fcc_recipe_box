
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
  template: "#editor",
  props: ["title"],
  methods: {
    handleInput: function() {
      if(this.$refs.title.value == "") {
        alert("The title field must be completed");
      }

      var record = {};
      record["title"] = this.$refs.title.value;
      record["serves"] = this.$refs.serves.value;
      record["ingredients"] = this.$refs.ingredients.value;
      record["method"] = this.$refs.method.value;
      this.$emit("new", record);
      this.clearForm();
    },
    clearForm: function() {
      this.$refs.title.value = "";
      this.$refs.serves.value = null;
      this.$refs.ingredients.value = "";
      this.$refs.method.value = "";
    }
  }
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
    db: myRecipes,
    editorTitle: "Add a New Recipe",
    newRecipe: {}
  },
  router: router,
  components: {
    logo: TitleBar,
    recipe: Recipe,
    "recipe-list": RecipeList,
    new: Editor
  },
  methods: {
    addNewRecipe: function(rec) {
      var key;
      key = "beans_on_toast";
      this.newRecipe = rec;
      this.db[key] = rec;
    }
  }

});
