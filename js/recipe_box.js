/*   Author: Richard Myatt
     Date: 20 June 2018
     Revised: 25 June 2018

     An exercise in data visualization and a second use of materialize.
*/

// Application nav/title bar component
var TitleBar = {
  template: "#logo"
};

// default view component
var DefaultView = {
  template: "#default"
};

// recipe list component for home page
var RecipeList = {
  template: "#list",
  props: ["db"]
};

// individual recipe component
var Recipe = {
  template: "#recipe",
  props: ["db"]
};

// editor component for new recipes and editing existing recipes
var Editor = {
  template: "#editor",
  props: ["title", "db", "status", "recipekey", "oldtitle"],
  methods: {
    // method handles the save event
    handleInput: function() {

      if(this.$refs.title.value == "") {
        alert("The title field must be completed");
        return;
      }

      var record = {};
      record.title = this.$refs.title.value;
      record.serves = this.$refs.serves.value;
      record.ingredients = this.$refs.ingredients.value;
      record.method = this.$refs.method.value;

      if(this.status === "new") {
        this.$emit("new", record);
        this.clearForm();
      } else if(this.status === "edit") {
        console.log("in handleInput status = edit");
        if(this.$refs.title.value === this.oldtitle) {
          this.$emit("update", record);
        } else {
          // delete old record and add new recipe
          this.$emit('del', this.recipekey);
          this.$emit('new', record);
        }

      }
    },
    // helper method to clear the form on save new recipe
    clearForm: function() {
      this.$refs.title.value = "";
      this.$refs.serves.value = null;
      this.$refs.ingredients.value = "";
      this.$refs.method.value = "";
    },
    populateForm: function() {
      this.$refs.title.value = this.db[this.recipekey].title;
      this.$refs.serves.value = this.db[this.recipekey].serves;
      this.$refs.ingredients.value = this.db[this.recipekey].ingredients;
      this.$refs.method.value = this.db[this.recipekey].method;
      M.textareaAutoResize(this.$refs.ingredients);
      M.textareaAutoResize(this.$refs.method);
    }
  },
  // populate input fields when editing a recipe
  mounted: function() {
    if(this.status === "edit") {
      this.populateForm();
    }
  },
  beforeUpdate: function() {
    if(this.status === "new") {
      this.clearForm();
    } else if(this.status === "edit") {
      this.populateForm();
    }
  }
};

// define the routes
var routes = [
  {path: "/", name: "Home", component: RecipeList},
  {path: "/recipe/:id", name: "Recipe", component: Recipe},
  {path: "/editor/new", name: "New",
  component: Editor,
  beforeEnter: (to, from, next) => {
    main.editorTitle = "Add a New Recipe";
    main.editorStatus = "new";
    next();
    }
  },
  {path: "/editor/edit", name: "Edit",
  component: Editor,
  beforeEnter: (to, from, next) => {
    main.editorTitle = "Edit Recipe";
    main.editorStatus = "edit";
    next();
    }
  },
  {path: "*",
  name: "Default",
  component: DefaultView,
  // change the background and do not show the title if we are entering the
  // default route
  beforeEnter: (to, from, next) => {
      main.show = false;
      next();
    }
  }
  ];

// define the router
var router = new VueRouter({
  routes: routes
});

// the main vue instance
var main = new Vue({
  el: "#app",
  data: {
    show: true,
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
    new: Editor,
    "default-view": DefaultView
  },
  methods: {
    // method to update a recipe after editing
    updateRecord: function(rec) {
      var db = this.db;
      var dbKey = this.currentRecipeKey;
      db[dbKey] = rec;
      this.resetLocalStorage();
      router.push({path: "/recipe/" + dbKey, component: Recipe});
    },
    // edit an existing recipe
    editRecipe: function(rec) {
      var db = this.db;
      this.currentRecipeKey = rec;
      this.currentRecipeTitle = db[rec].title;
      router.push({path: "/editor/edit", component: Editor});
    },
    // save new or edited recipe
    saveRecipe: function(rec) {
      var key = this.getKey(rec.title);
      this.db[key] = rec;
      this.resetLocalStorage();

      if(this.editorStatus === "edit") {
        this.currentRecipeKey = key;
        this.currentRecipeTitle = rec.title;
        router.push({path: "/recipe/" + this.currentRecipeKey, component: Recipe});
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
  },
  mounted: function() {
      router.push({path: "/", component:RecipeList});
  }
});

// check to see where the route is going and change show to true if not 'Default'
router.afterEach((to, from) => {

    if(main.$route.name !== "Default") {
      main.show = true;
    }
  }
);

// initialize the materialize model(document.addEventListener('DOMContentLoaded', function() {
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});

// initialize the materialize sidenav
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {});
});
