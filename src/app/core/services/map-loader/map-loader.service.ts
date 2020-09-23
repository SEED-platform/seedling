import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapLoaderService {
  private promise;

  constructor() { }

  public load(): Promise<string> {
    if (!this.promise) {
      this.promise = new Promise(resolve => {
        console.log('MapLoaderService.load()');
        
        window['__onBingLoaded'] = () => {
          resolve('Bing Maps API loaded');
        };

        const node = document.createElement('script');
        node.src = `https://www.bing.com/api/maps/mapcontrol?callback=__onBingLoaded&key=${process.env.BING_API_KEY}`;
        node.type = 'text/javascript';
        node.async = true;
        node.defer = true
        document.getElementsByTagName('head')[0].appendChild(node);
      })
    }

    return this.promise;
  }
}
