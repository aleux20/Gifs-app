import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);
  private readonly historyKey = 'gif-search-history';

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(false);
  private trendingPage = 0;
  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    console.log('Trending GIF Groups:', { groups });
    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadHistory();
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);
    const offset = this.trendingPage * 20;

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: '20',
          offset: String(offset),
        },
      })
      .subscribe((response) => {
        const gifs = GifMapper.mapGiphyResponseArrayToGifArray(response.data);

        this.trendingGifs.update((currentGifs) => {
          const seenIds = new Set(currentGifs.map((gif) => gif.id));
          const uniqueGifs = gifs.filter((gif) => !seenIds.has(gif.id));
          return [...currentGifs, ...uniqueGifs];
        });

        this.trendingPage += 1;
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          q: query,
          limit: '20',
        },
      })
      .pipe(
        map((response) => GifMapper.mapGiphyResponseArrayToGifArray(response.data)),
        tap((gifs) => {
          this.searchHistory.update((history) => {
            const nextHistory = {
              ...history,
              [query]: gifs,
            };

            this.saveHistory(nextHistory);
            return nextHistory;
          });
        }),
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

  private loadHistory(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const history = localStorage.getItem(this.historyKey);

    if (!history) return;

    try {
      const parsedHistory = JSON.parse(history) as Record<string, Gif[]>;
      this.searchHistory.set(parsedHistory);
    } catch {
      localStorage.removeItem(this.historyKey);
    }
  }

  private saveHistory(history: Record<string, Gif[]> = this.searchHistory()): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }
}
