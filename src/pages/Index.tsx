
// Find and fix the following line in the newProjectForm setup
// Original:
// defaultValues: {
//   title: "",
//   type: "film", // Set a default project type to avoid empty string error
// },

// Fix to use the correct enum value:
defaultValues: {
  title: "",
  type: "movie", // Using the correct ProjectType enum value
},
