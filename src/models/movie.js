
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
    this.watchingDate = info[`watching_date`];
    this.isInWatchList = info[`watchlist`];
  }

  static parseMovie(movie) {
    return new Movie(movie);
  }

  static parseMovies(movies) {
    return movies.map(Movie.parseMovie);
  }
}
