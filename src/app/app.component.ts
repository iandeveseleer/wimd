import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
import {SearchService} from './services/search-service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgIcon, NgIconStack} from '@ng-icons/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink, RouterLinkActive, NgIcon, NgIconStack],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'WIMD';

  showSearch: boolean = false; // Par défaut, la recherche est masquée
  searchText: string = ''; // Variable pour le champ de recherche
  isSticky: boolean = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // S'abonner aux changements de visibilité de la recherche
    this.searchService.showSearch$.subscribe(visible => {
      this.showSearch = visible;
    });

    // S'abonner aux changements de texte de recherche
    this.searchService.searchText$.subscribe(text => {
      this.searchText = text;
    });
  }

  // Lorsque l'utilisateur modifie le texte de recherche, on met à jour dans le service
  onSearchChange() {
    this.searchService.updateSearchText(this.searchText);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;

    // When the user scrolls more than 50px, make the navbar sticky
    if (scrollPosition > 50) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }
}
