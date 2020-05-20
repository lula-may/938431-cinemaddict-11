
export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this._parseMovieInfo(data[`film_info`]);
    this._parseUserInfo(data[`user_details`]);
  }

  _parseMovieInfo(info) {
    this.actors = info[`actors`];
    this.age = info[`age_rating`];
    this.originalTitle = info[`alternative_title`];
    this.description = info[`description`];
    this.director = info[`director`];
    this.genres = info[`genre`];
    this.poster = info[`poster`];
    const release = info[`release`];
    this.date = new Date(release[`date`]);
    this.country = release[`release_country`];
    this.duration = info[`runtime`];
    this.title = info[`title`];
    this.rating = info[`total_rating`];
    this.writers = info[`writers`];
  }

  _parseUserInfo(info) {
    this.isInHistory = info[`already_watched`];
    this.isFavorite = info[`favorite`];
    this.watchingDate = info[`watching_date`] ? new Date(info[`watching_date`]) : null;
    this.isInWatchlist = info[`watchlist`];
  }

  convertToRaw() {
    const release = {
      "date": this.date.toISOString(),
      "release_country": this.country
    };

    const filmInfo = {
      "actors": this.actors,
      "age_rating": this.age,
      "alternative_title": this.originalTitle,
      "description": this.description,
      "director": this.director,
      "genre": this.genres,
      "poster": this.poster,
      "release": release,
      "runtime": this.duration,
      "title": this.title,
      "total_rating": this.rating,
      "writers": this.writers
    };

    const userDetails = {
      "already_watched": this.isInHistory,
      "favorite": this.isFavorite,
      "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
      "watchlist": this.isInWatchlist
    };

    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": filmInfo,
      "user_details": userDetails
    };
  }

  updateComments(comments) {
    const newComments = comments.map((item) => item.id);
    this.comments = newComments;
  }

  static parseMovie(movie) {
    return new Movie(movie);
  }

  static parseMovies(movies) {
    return movies.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.convertToRaw());
  }
}
