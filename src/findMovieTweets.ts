import TwitterApi from 'twitter-api-v2';

interface TweetData {
  title: string;
  year: number;
  likes: number;
}

const MOVIE_TWEET_REGEX = /\s*Now watching:(.+)\(([\d]{4})\)/i;

export const findMovieTweets = async (
  username: string,
  count: number = 500
) => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY || '',
    appSecret: process.env.TWITTER_APP_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
  }).readOnly.v1;

  const userTimeline = await client.userTimelineByUsername(username);
  await userTimeline.fetchLast(count);

  const movieTweets = userTimeline.tweets.reduce(
    (movieTweets: TweetData[], tweet) => {
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
          poster: tweet.entities.media?.[0]?.media_url_https,
        },
      ];
    },
    []
  );

  return movieTweets;
};
