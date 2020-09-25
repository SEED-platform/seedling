import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _expandedNavSubject = new BehaviorSubject(false);
  readonly expandedNav$ = this._expandedNavSubject.asObservable().pipe(distinctUntilChanged());

  constructor() {
    this._loadExpandedNav();
  }

  toggleExpandedNav(): void {
    this._expandedNavSubject.next(!this._expandedNavSubject.value);

    this._saveExpandedNav();
  }

  private _loadExpandedNav(): void {
    const result = localStorage.getItem('expanded');
    if (result !== null) {
      try {
        this._expandedNavSubject.next(JSON.parse(result));
      } catch (e) {
        console.error(e);
      }
    }
  }

  private _saveExpandedNav(): void {
    localStorage.setItem('expanded', JSON.stringify(this._expandedNavSubject.value));
  }
}
