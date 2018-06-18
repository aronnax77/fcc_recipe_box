
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
    db: {},
    editorStatus: "",
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
      var key = this.getKey(rec.title);
      this.db[key] = rec;
      // clear and reset localStorage
      localStorage.clear();
      localStorage.setItem("myRecipes", JSON.stringify(this.db));
    },
    getKey: function(str) {
      str = str.toLowerCase();
      str  = str.split(" ").join("_");
      return str;
    }
  },
  created: function() {
    console.log('in beforeMount ' + localStorage.getItem("myRecipes"));
    if(localStorage.getItem("myRecipes") === null) {
      localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
      this.db = myRecipes;
    } else {
      var storedData = localStorage.getItem("myRecipes");
      console.log("storedData = " + storedData);
      storedData = JSON.parse(storedData);
      this.db = storedData;
    }
  }
});

//localStorage.setItem("test", JSON.stringify(test));
//localStorage.setItem("test", test);
