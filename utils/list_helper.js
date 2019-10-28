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
      // reorder by count of blogs
      .orderBy("blogs", ["desc"])
      .value();

    // authorStats = [
    //   { author: "Robert C. Martin", blogs: 3 },
    //   { author: "Edsger W. Dijkstra", blogs: 2 },
    //   { author: "Michael Chan", blogs: 1 }
    // ];

    // return first element
    return _.head(authorStats);
  }
};

const mostLikes = blogs => {
  if (!blogs || !blogs.length) {
    return undefined;
  }
  if (blogs.length === 1) {
    const output = { author: blogs[0].author, likes: blogs[0].likes };
    return output;
  } else {
    const blogAuthorsLikes = _(blogs)
      .groupBy("author")
      // Create a key named like author and reduce total likes
      .map((blogs, author) => ({
        author,
        likes: blogs.reduce((sum, blog) => {
          return sum + blog.likes;
        }, 0)
      }))
      .orderBy("likes", ["desc"])
      .value();

    // blogAuthorsLikes = [
    //   { author: "Robert C. Martin", blogs: 3 },
    //   { author: "Edsger W. Dijkstra", blogs: 2 },
    //   { author: "Michael Chan", blogs: 1 }
    // ];

    // return only the most liked author
    return _.head(blogAuthorsLikes);
  }
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
