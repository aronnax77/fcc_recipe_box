
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
  props: ["title", "status", "db", "recipekey", "oldtitle"],
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

      if(this.status === "new") {
        this.$emit("new", record);
        this.clearForm();
      } else if(this.status === "edit") {
        if(this.$refs.title.value === this.oldtitle) {
          this.$emit("update", record);
        } else {
          // delete old record and add new recipe
          this.$emit('del', this.recipekey);
          this.$emit('new', record);
        }

      }
    },
    clearForm: function() {
      this.$refs.title.value = "";
      this.$refs.serves.value = null;
      this.$refs.ingredients.value = "";
      this.$refs.method.value = "";
    }
  },
  // populate input fields when editing a recipe
  mounted: function() {
    if(this.status === "edit") {
      this.$refs.title.value = this.db[main.currentRecipeKey].title;
      this.$refs.serves.value = this.db[main.currentRecipeKey].serves;
      this.$refs.ingredients.value = this.db[main.currentRecipeKey].ingredients;
      this.$refs.method.value = this.db[main.currentRecipeKey].method;
      M.textareaAutoResize(this.$refs.ingredients);
      M.textareaAutoResize(this.$refs.method);
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.$emit('reseteditor');
    next();
  },
  watch: {
    status: function() {
      if(this.status === "new") {
        this.clearForm();
      }
    }
  }
};

// define the routes
var routes = [
  {path: "/", component: RecipeList},         //RecipeList
  {path: "/recipe/:id", component: Recipe},
  {path: "/editor/new", component: Editor},
  {path: "*", component: NotFoundComponent}
];

var router = new VueRouter({
  routes: routes
});

var main = new Vue({
  el: "#app",
  data: {
    db: {},
    editorStatus: "",
    editorTitle: "",
    currentRecipeKey: "",
    currentRecipeTitle: ""
  },
  router: router,
  components: {
    logo: TitleBar,
    recipe: Recipe,
    "recipe-list": RecipeList,
    new: Editor
  },
  methods: {
    resetEditor: function() {
      this.editorStatus = "";
      this.editorTitle = "";
      this.currentRecipeKey = "";
      this.currentRecipeTitle = "";
    },
    updateRecord: function(rec) {
      var db = this.db;
      db[this.currentRecipeKey] = rec;
      this.resetLocalStorage();
      console.log("in update record");
    },
    // edit and existing recipe
    editRecipe: function(rec) {
      var db = this.db;
      this.editorStatus = "edit";
      this.editorTitle = "Edit Recipe";
      this.currentRecipeKey = rec;
      this.currentRecipeTitle = db[rec].title;
      router.push({path: "/editor/new", component: Editor});
    },
    // save new or edited recipe
    saveRecipe: function(rec) {
      var key = this.getKey(rec.title);
      this.db[key] = rec;
      this.resetLocalStorage();

      if(this.editorStatus === "edit") {
        this.currentRecipeKey = key;
        this.currentRecipeTitle = rec.title;
      }
    },
    // clear and reset localStorage
    resetLocalStorage: function() {
      localStorage.clear();
      localStorage.setItem("myRecipes", JSON.stringify(this.db));
    },
    // helper function to get the key for a recipe
    getKey: function(str) {
      str = str.toLowerCase();
      str  = str.split(" ").join("_");
      return str;
    },
    // open the editor to process a new recipe
    openEditorForNewRecipe: function() {
      this.editorStatus = "new";
      this.editorTitle = "Add a New Recipe";
      this.currentRecipeKey = "";
      this.currentRecipeTitle = "";
      router.push({path: "/editor/new", component: Editor});
    },
    // delete an existing recipe
    deleteRecipe: function(key) {
      var choice;
      if(this.editorStatus !== "edit") {
        choice = confirm("Are you sure you want to delete this recipe?");
      } else {
        choice = true;
      }
      if(choice === true) {
        Vue.delete(this.db, key);
        if(this.editorStatus !== "edit") {
          router.push({path: "/", component: RecipeList});
        }
        this.resetLocalStorage();
      } else {
        return;
      }

    }
  },
  // initialize the application
  created: function() {
    if(localStorage.getItem("myRecipes") === null) {
      localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
      this.db = myRecipes;
    } else {
      var storedData = localStorage.getItem("myRecipes");
      storedData = JSON.parse(storedData);
      this.db = storedData;
    }
  }
});
