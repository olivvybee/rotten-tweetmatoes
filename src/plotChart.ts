import { createCanvas, loadImage } from 'canvas';

import { MovieTweet } from './interfaces';

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 3000;

const BACKGROUND_COLOUR = '#ceb4fd';
const TEXT_COLOUR = '#282c34';

const TITLE_FONT_SIZE = 144;
const BODY_FONT_SIZE = 64;

const TITLE_FONT = `bold ${TITLE_FONT_SIZE}px sans-serif`;
const BODY_FONT = `${BODY_FONT_SIZE}px sans-serif`;

const BAR_COLOUR = '#0d53d6';
const BAR_HEIGHT = 120;

const POSTER_HEIGHT = BODY_FONT_SIZE + BAR_HEIGHT + 16;
const POSTER_WIDTH = (2 * POSTER_HEIGHT) / 3;

const MAX_BAR_WIDTH = CANVAS_WIDTH - POSTER_WIDTH - 16 - 48;

let y = 48;

export const plotChart = (movieTweets: MovieTweet[], username: string) => {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BACKGROUND_COLOUR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.font = TITLE_FONT;
  ctx.fillStyle = TEXT_COLOUR;
  ctx.textBaseline = 'top';
  ctx.fillText('Rotten Tweetmatoes', 24, y);

  y += TITLE_FONT_SIZE + 48;

  ctx.font = BODY_FONT;
  ctx.fillText(`@${username}'s top movies`, 24, y);

  y += BODY_FONT_SIZE + 24;

  ctx.font = `italic ${BODY_FONT}`;
  ctx.fillText('ranked by number of twitter likes', 24, y);

  y += BODY_FONT_SIZE + 96;

  const maxLikes = movieTweets[0].likes;

  movieTweets.forEach((movieTweet) => {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = BODY_FONT;
    ctx.fillStyle = TEXT_COLOUR;
    ctx.fillRect(24, y, POSTER_WIDTH, POSTER_HEIGHT);

    if (movieTweet.poster) {
      ctx.drawImage(movieTweet.poster, 24, y, POSTER_WIDTH, POSTER_HEIGHT);
    }

    const x = 24 + POSTER_WIDTH + 16;

    ctx.fillText(`${movieTweet.title} (${movieTweet.year})`, x, y);

    y += BODY_FONT_SIZE + 16;

    const barWidth = MAX_BAR_WIDTH * (movieTweet.likes / maxLikes);

    ctx.fillStyle = BAR_COLOUR;
    ctx.fillRect(x, y, barWidth, BAR_HEIGHT);

    y += BAR_HEIGHT / 2;

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.fillText(`${movieTweet.likes}`, x + barWidth - 16, y);

    y += BODY_FONT_SIZE + 48;
  });

  return canvas.toBuffer();
};
