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

module.exports = { dummy, totalLikes, favoriteBlog };
