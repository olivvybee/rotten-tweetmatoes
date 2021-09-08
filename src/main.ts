import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { findMovieTweets } from './findMovieTweets';

export const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .option('username', {
      alias: 'u',
      type: 'string',
      description: 'The username of the twitter user to analyse',
    })
    .option('count', {
      alias: 'c',
      type: 'number',
      description: 'The total number of tweets to fetch to find movie tweets',
      default: 250,
    }).argv;

  if (!argv.username) {
    console.error('--username option is required.');
    process.exit(1);
  }

  const movieTweets = await findMovieTweets(argv.username, argv.count);
  console.log(movieTweets);
};
