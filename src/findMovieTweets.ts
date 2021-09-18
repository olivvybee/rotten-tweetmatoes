import { loadImage } from 'canvas';
import TwitterApi from 'twitter-api-v2';

import { MovieTweet } from './interfaces';

const MOVIE_TWEET_REGEX = /\s*Now watching:(.+)\(([\d]{4})\)/i;

export const findMovieTweets = async (
  username: string,
  count: number,
  currentMonth: boolean = false
) => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY || '',
    appSecret: process.env.TWITTER_APP_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  }).readOnly.v1;

  const userTimeline = await client.userTimelineByUsername(username);

  const now = new Date();
  const day = now.getDate();
  const month = day > 7 ? now.getMonth() : now.getMonth() - 1;

  if (currentMonth) {
    let finished = false;
    while (!finished) {
      await userTimeline.fetchNext();
      const lastTweet = userTimeline.tweets[userTimeline.tweets.length - 1];
      const lastTweetDate = new Date(lastTweet.created_at);
      if (lastTweetDate.getMonth() < month) {
        finished = true;
      }
    }
  } else {
    await userTimeline.fetchLast(count);
  }

  const filteredTweets = currentMonth
    ? userTimeline.tweets.filter((tweet) => {
        const tweetDate = new Date(tweet.created_at);
        return tweetDate.getMonth() === month;
      })
    : userTimeline.tweets;

  const movieTweets = filteredTweets.reduce(
    (movieTweets: MovieTweet[], tweet) => {
      const match = tweet.full_text?.match(MOVIE_TWEET_REGEX);
      if (!match) {
        return movieTweets;
      }

      return [
        ...movieTweets,
        {
          title: match[1].trim(),
          year: Number(match[2]),
          likes: tweet.favorite_count,
          posterUrl: tweet.entities.media?.[0]?.media_url_https,
        },
      ];
    },
    []
  );

  const sortedTweets = movieTweets
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  const promises = sortedTweets.map(async (tweet) => {
    if (tweet.posterUrl) {
      const poster = await loadImage(tweet.posterUrl);
      return {
        ...tweet,
        poster,
      };
    } else {
      return tweet;
    }
  });

  return await Promise.all(promises);
};
