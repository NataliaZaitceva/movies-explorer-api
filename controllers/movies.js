const BadRequest = require('../Errors/BadRequest'); // 400
const NotFoundError = require('../Errors/NotFoundError'); // 404
const ForbiddenError = require('../Errors/ForbiddenError');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnal, movieId,
    nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnal,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(' ID карточки не существует');
    })
    .then((user) => {
      if (!user.owner.equals(req.user._id)) {
        throw new ForbiddenError('Переданы некорректные данные');
      }
      Movie.findByIdAndDelete(req.params.cardId)
        .then((movie) => res.send({ movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
