import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {AltchaComponent} from '../../altcha/altcha.component';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MachineService} from '../../services/machine-service';
import {ManufacturerService} from '../../services/manufacturer-service';
import {TypeService} from '../../services/type-service';
import {SearchService} from '../../services/search-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [
    NgForOf,
    NgIcon,
    NgIf,
    AltchaComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit {
  machines: any[] = []; // Liste des équipements
  machineTypes: any[] = []; // Liste des types d'équipements
  manufacturers: any[] = []; // Liste des fabricants

  filteredMachines: any[] = []; // Liste des machines filtrées

  searchText: string = '';

  loadingMachines: boolean = true;
  loadingTypes: boolean = true;

  private modalRef!: NgbModalRef;

  addMachineForm!: FormGroup; // Formulaire pour ajouter une machine
  @ViewChild('addMachineFormTemplate') addMachineFormTemplate!: TemplateRef<any>;


  constructor(private machineService: MachineService,
              private typeService: TypeService,
              private manufacturerService: ManufacturerService,
              private searchService: SearchService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.addMachineForm = this.fb.group({
      name: ['', [Validators.required]],
      manufacturerId: [null, [Validators.required]],
      typeId: ['', [Validators.required]],
      machine_altcha: new FormControl(''),
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
    // Charger les machines
    this.machineService.getMachines().valueChanges.subscribe((result: any) => {
        this.machines = result.data?.getAllMachines;
        this.filteredMachines = this.machines;
        this.loadingMachines = false; // Fin du chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des machines', error);
        this.loadingMachines = false; // Fin du chargement même en cas d'erreur
      }
    );

    // Charger les fabricants
    this.manufacturerService.getManufacturers().valueChanges.subscribe((result: any) => {
        this.manufacturers = result.data?.getAllManufacturers;
      },
      (error) => {
        console.error("Erreur lors du chargement des fabricants", error);
      }
    )


    // Charger les types d'équipements
    this.typeService.getTypes().valueChanges.subscribe((result: any) => {
        this.machineTypes = result.data?.getAllTypes; // Stocke la liste des types d'équipements
        this.loadingTypes = false; // Fin du chargement
      },
      (error) => {
        console.error("Erreur lors du chargement des types d'équipements", error);
        this.loadingTypes = false; // Fin du chargement même en cas d'erreur
      }
    );
  }

  filter(): void {
    if (this.searchText) {
      this.filteredMachines = this.machines.filter(machine =>
        machine.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        machine.type.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        machine.manufacturer.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredMachines = this.machines;
    }
  }


  addMachine() {
    if (this.addMachineForm.invalid) {
      return; // Si le formulaire est invalide, ne rien faire
    }
    const machineData = this.addMachineForm.value;
    this.machineService.createMachine(machineData).subscribe((result) => {
      const newMachine = result.data?.createMachine;
      if (newMachine) {
        this.machines = [...this.machines, newMachine];
        this.filteredMachines = [...this.filteredMachines, newMachine];
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

  viewMachineDetails(id: string): void {
    this.router.navigate(['/machines', id]);
  }
}
