import { Gif } from '../interfaces/gif.interface';
import { GiphyItem } from '../interfaces/giphy.interfaces';

export class GifMapper {
  static mapGiphyResponseToGif(giphyResponse: GiphyItem): Gif {
    return {
      id: giphyResponse.id,
      title: giphyResponse.title,
      url: giphyResponse.images.original.url,
    };
  }

  static mapGiphyResponseArrayToGifArray(giphyResponses: GiphyItem[]): Gif[] {
    return giphyResponses.map(this.mapGiphyResponseToGif);
  }
}
