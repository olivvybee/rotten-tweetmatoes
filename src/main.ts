import path from 'path';
import fs from 'fs';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { findMovieTweets } from './findMovieTweets';
import { plotChart } from './plotChart';

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
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'Path to save the chart image',
      default: 'rotten_tweetmatoes.png',
    }).argv;

  const { username, count, output } = argv;

  if (!username) {
    console.error('--username option is required.');
    process.exit(1);
  }

  const movieTweets = await findMovieTweets(username, count);

  const imageData = plotChart(movieTweets, username);

  const outputFilename = output.endsWith('.png') ? output : `${output}.png`;
  const outputPath = path.resolve(__dirname, outputFilename);
  fs.writeFileSync(outputPath, imageData);
};
