// .eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addLayoutAlias("default", "base.njk");
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data:    "data",
      output:  "_site"
    },
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
