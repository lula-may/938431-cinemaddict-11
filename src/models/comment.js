export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.emotion = data[`emotion`];
    this.text = data[`comment`];
    this.date = new Date(data[`date`]);
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }
}
