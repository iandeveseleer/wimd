import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ManufacturerService} from '../../services/manufacturer-service';
import {SearchService} from '../../services/search-service';
import {Router} from '@angular/router';
import {MachinesComponent} from '../machines/machines.component';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {VenuesComponent} from '../venues/venues.component';
import {AltchaComponent} from '../../altcha/altcha.component';

@Component({
  selector: 'app-manufacturers',
  standalone: true,
  imports: [
    MachinesComponent,
    NgIf,
    NgTemplateOutlet,
    VenuesComponent,
    AltchaComponent,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './manufacturers.component.html',
  styleUrl: './manufacturers.component.css'
})
export class ManufacturersComponent {
  manufacturers: any[] = []; // Liste des fabricants

  filteredManufacturers: any[] = []; // Liste des fabricants filtrés

  searchText: string = '';
  loadingManufacturers: boolean = true;

  private modalRef!: NgbModalRef;

  addManufacturerForm!: FormGroup; // Formulaire pour ajouter un fabricant
  @ViewChild('addManufacturerFormTemplate') addManufacturerFormTemplate!: TemplateRef<any>;

  constructor(private manufacturerService: ManufacturerService,
              private searchService: SearchService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.addManufacturerForm = this.fb.group({
      name: ['', [Validators.required]],
      manufacturer_altcha: new FormControl(''),
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

    // Charger les fabricants
    this.manufacturerService.getManufacturers().valueChanges.subscribe((result: any) => {
        this.manufacturers = result.data?.getAllManufacturers;
        this.filteredManufacturers = this.manufacturers;
        this.loadingManufacturers = false; // Fin du chargement
      },
      (error) => {
        console.error("Erreur lors du chargement des fabricants", error);
        this.loadingManufacturers = false; // Fin du chargement même en cas d'erreur
      }
    )
  }

  filter(): void {
    if (this.searchText) {
      this.filteredManufacturers = this.manufacturers.filter(manufacturer =>
        manufacturer.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredManufacturers = this.manufacturers;
    }
  }

  addManufacturer() {
    if (this.addManufacturerForm.invalid) {
      return; // Si le formulaire est invalide, ne rien faire
    }
    const manufacturerData = this.addManufacturerForm.value;
    this.manufacturerService.createManufacturer(manufacturerData).subscribe((result) => {
      const newManufacturer = result.data?.createManufacturer;
      if (newManufacturer) {
        this.manufacturers = [...this.manufacturers, newManufacturer];
        this.filteredManufacturers = [...this.filteredManufacturers, newManufacturer];
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
}
