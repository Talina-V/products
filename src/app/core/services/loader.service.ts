import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isActiveLoader$$ = new BehaviorSubject<boolean>(false);
  public isActiveLoader$ = this.isActiveLoader$$.asObservable();

  show(): void {
    this.isActiveLoader$$.next(true);
  }

  hide(): void {
    this.isActiveLoader$$.next(false);
  }

}
