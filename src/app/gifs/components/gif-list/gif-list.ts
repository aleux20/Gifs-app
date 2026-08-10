import { Component, input } from '@angular/core';
import { GifListItem } from './gif-list-item/gif-list-item';

@Component({
  selector: 'app-gif-list',
  imports: [GifListItem],
  templateUrl: './gif-list.html',
})
export class GifList {
  gifs = input.required<string[]>();
}
