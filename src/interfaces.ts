import { Image } from 'canvas';

export interface MovieTweet {
  title: string;
  year: number;
  likes: number;
  posterUrl?: string;
  poster?: Image;
}
