import { Component } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'app-trending-page',
  imports: [GifList],
  templateUrl: './trending-page.html',
})
export default class TrendingPage {}
