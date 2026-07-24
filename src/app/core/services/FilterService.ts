import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  readonly enabledTypes = signal(new Set<string>());

  initialize(types: string[]): void {

    this.enabledTypes.set(
      new Set(types)
    );

  }

  toggle(type: string): void {

    const next = new Set(this.enabledTypes());

    if (next.has(type)) {

      next.delete(type);

    } else {

      next.add(type);

    }

    this.enabledTypes.set(next);

  }

  isEnabled(type: string): boolean {

    return this.enabledTypes().has(type);

  }

 isVisible(type: string): boolean {

    return this.enabledTypes().has(type);

}

}