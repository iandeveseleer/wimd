import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {VenueService} from '../../services/venue-service';
import {VenueTypeService} from '../../services/venue-type-service';
import {SearchService} from '../../services/search-service';
import {Router} from '@angular/router';
import {AltchaComponent} from '../../altcha/altcha.component';
import {NgIconComponent} from '@ng-icons/core';

@Component({
  selector: 'app-venues',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AltchaComponent,
    NgIconComponent
  ],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit {
  venues: any[] = []; // Liste des lieux
  filteredVenues: any[] = []; // Liste des lieux filtrés
  venueTypes: any[] = []; // Liste des types de lieux

  searchText: string = '';
  loadingVenues: boolean = true;
  loadingVenueTypes: boolean = true;

  private modalRef!: NgbModalRef;

  addVenueForm!: FormGroup; // Formulaire pour ajouter un lieu

  @ViewChild('addVenueFormTemplate') addVenueFormTemplate!: TemplateRef<any>;

  constructor(private venueService: VenueService,
              private venueTypeService: VenueTypeService,
              private searchService: SearchService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.addVenueForm = this.fb.group({
      name: ['', [Validators.required]],
      venueTypeId: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      street: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      venue_altcha: new FormControl(''),
    });

    // Activer l'affichage du champ de recherche
    this.searchService.setSearchVisibility(true);

    this.loadDatas();

    // Synchroniser le texte de recherche avec le service
    this.searchService.searchText$.subscribe(text => {
      this.searchText = text;
      this.filter();
    });
  }

  private loadDatas() {

    // Charger les lieux
    this.venueService.getVenues().valueChanges.subscribe((result: any) => {
        this.venues = result.data?.getAllVenues;
        this.filteredVenues = this.venues;
        this.loadingVenues = false; // Fin du chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des lieux', error);
        this.loadingVenues = false; // Fin du chargement même en cas d'erreur
      }
    );

    // Charger les types de lieux
    this.venueTypeService.getVenueTypes().valueChanges.subscribe((result: any) => {
        this.venueTypes = result.data?.getAllVenueTypes; // Stocke la liste des types de lieux
        this.loadingVenueTypes = false; // Fin du chargement
      },
      (error) => {
        console.error("Erreur lors du chargement des types de lieux", error);
        this.loadingVenueTypes = false; // Fin du chargement même en cas d'erreur
      }
    );
  }

  filter(): void {
    if (this.searchText) {
      this.filteredVenues = this.venues.filter(venue =>
        venue.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        venue.city.toLowerCase().includes(this.searchText.toLowerCase()) ||
        venue.venueType.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredVenues = this.venues;
    }
  }

  addVenue() {
    if (this.addVenueForm.invalid) {
      return; // Si le formulaire est invalide, ne rien faire
    }
    const venueData = this.addVenueForm.value;
    this.venueService.createVenue(venueData).subscribe((result) => {
      const newVenue = result.data?.createVenue;
      if (newVenue) {
        // Use the spread operator to avoid directly mutating the array
        this.venues = [...this.venues, newVenue];
        this.filteredVenues = [...this.filteredVenues, newVenue]; // Sync filtered list
      }
      this.modalService.dismissAll(); // Ferme le modal après soumission
    });
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  close(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  viewVenueDetails(id: string): void {
    this.router.navigate(['/venues', id]);
  }
}
