import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Création d'un BehaviorSubject pour gérer le texte de recherche
  private showSearchSubject = new BehaviorSubject<boolean>(false); // Par défaut, la recherche est masquée
  private searchTextSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSubject.asObservable();
  showSearch$ = this.showSearchSubject.asObservable();

  // Méthode pour mettre à jour le texte de recherche
  updateSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
  }

  // Méthode pour activer ou désactiver la barre de recherche
  setSearchVisibility(visible: boolean): void {
    this.showSearchSubject.next(visible);
  }
}
