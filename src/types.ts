interface IGenre {
  id: number;
  name: string;
}

export interface IMovie {
  id?: number;
  poster_path: string;
  backdrop_path?: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: IGenre[];
}

export interface ITrendingMoviesResponse {
  results: IMovie[];
}

export interface ISearchMoviesResponse {
  results: IMovie[];
  total_pages: number;
}

export interface IMovieCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  gender: number;
}

export interface IMovieCast {
  cast: IMovieCastMember[];
}

export interface IMovieReview {
  id: string;
  author: string;
  content: string;
}

export interface IMovieReviewsResponse {
  results: IMovieReview[];
}

export interface IIsActiveProps {
  isActive: boolean;
}
