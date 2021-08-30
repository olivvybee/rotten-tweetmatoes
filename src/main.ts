import { findMovieTweets } from './findMovieTweets';

export const main = async () => {
  const movieTweets = await findMovieTweets('olivvybee', 1000);
  console.log(movieTweets);
};
