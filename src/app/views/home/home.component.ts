import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgIconComponent} from '@ng-icons/core';
import {AltchaComponent} from '../../altcha/altcha.component';
import {SearchService} from '../../services/search-service';
import {VenuesComponent} from '../venues/venues.component';
import {MachinesComponent} from '../machines/machines.component';
import {ManufacturersComponent} from '../manufacturers/manufacturers.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, AltchaComponent, NgIconComponent, VenuesComponent, MachinesComponent, ManufacturersComponent],
})
export class HomeComponent implements OnInit {


  constructor(private searchService: SearchService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // Activer l'affichage du champ de recherche
    this.searchService.setSearchVisibility(true);
  }
}
