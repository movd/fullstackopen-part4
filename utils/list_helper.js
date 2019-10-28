const _ = require("lodash");
const dummy = () => 1;

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
};

const favoriteBlog = blogs => {
  if (!blogs || !blogs.length) {
    return undefined;
  }
  return blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });
};

const mostBlogs = blogs => {
  if (!blogs || !blogs.length) {
    return undefined;
  }
  if (blogs.length === 1) {
    const output = { author: blogs[0].author, blogs: blogs.length };
    return output;
  } else {
    // lodash groupBy with added key took clues from here: <https://stackoverflow.com/q/23600897>

    // Creates array where each element contains an object with both author and count of blogs
    const authorStats = _(blogs)
      .groupBy("author")
      .map((blogs, author) => ({ author, blogs: blogs.length }))
      .value();

    // authorStats = [
    //   { author: "Michael Chan", blogs: 1 },
    //   { author: "Edsger W. Dijkstra", blogs: 2 },
    //   { author: "Robert C. Martin", blogs: 3 }
    // ];

    // reorder by blogcount and return first element
    return _.head(_.orderBy(authorStats, "blogs", ["desc"]));
  }
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
