export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.emotion = data[`emotion`];
    this.text = data[`comment`];
    this.date = data[`date`] ? new Date(data[`date`]) : null;
  }

  convertToRaw() {
    return {
      "comment": this.text,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.emotion,
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }

  static clone(comment) {
    return new Comment(comment.convertToRaw());
  }
}
