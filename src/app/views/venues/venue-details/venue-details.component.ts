import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgIcon} from '@ng-icons/core';
import {MachineService} from '../../../services/machine-service';
import {SearchService} from '../../../services/search-service';
import {VenueService} from '../../../services/venue-service';
import {MapComponent} from '../../../components/map.component';

@Component({
  standalone: true,
  selector: 'app-venue-details',
  templateUrl: 'venue-details.component.html',
  imports: [CommonModule, FormsModule, NgIcon, MapComponent]
})
export class VenueDetailsComponent implements OnInit {
  venue: any; // Venue data
  machines: any[] = []; // List of all machines
  filteredMachinesToAdd: any[] = []; // Machines not in the venue
  filteredMachinesToRemove: any[] = []; // Machines currently in the venue
  selectedMachineId: string = ''; // Selected machine ID for adding or removing
  loading: boolean = true; // Loading state

  constructor(
    private venueService: VenueService,
    private machineService: MachineService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.setSearchVisibility(false);

    const id = this.route.snapshot.paramMap.get('id');

    // Fetch the venue details
    this.venueService.getVenueById(id!).valueChanges.subscribe(
      (response) => {
        this.venue = response.data.getVenue;
        this.updateFilteredMachines(); // Update both dropdown lists
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des détails du lieu', error);
        this.loading = false;
      }
    );

    // Fetch the list of machines
    this.machineService.getMachines().valueChanges.subscribe(
      (result: any) => {
        this.machines = result.data?.getAllMachines || [];
        this.updateFilteredMachines(); // Update both dropdown lists
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des machines', error);
        this.loading = false;
      }
    );
  }

  // Add a machine to the venue
  addMachine(): void {
    if (!this.selectedMachineId) return;

    this.venueService.addMachineToVenue(this.venue.id, this.selectedMachineId).subscribe(
      (response: any) => {
        this.venue = response.data.addMachineToVenue; // Update venue data
        this.updateFilteredMachines(); // Refresh dropdown lists
        this.selectedMachineId = ''; // Reset the dropdown
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la machine au lieu', error);
      }
    );
  }

  // Remove a machine from the venue
  removeMachine(): void {
    if (!this.selectedMachineId) return;

    this.venueService.removeMachineFromVenue(this.venue.id, this.selectedMachineId).subscribe(
      (response: any) => {
        this.venue = response.data.removeMachineFromVenue; // Update venue data
        this.updateFilteredMachines(); // Refresh dropdown lists
        this.selectedMachineId = ''; // Reset the dropdown
      },
      (error) => {
        console.error('Erreur lors de la suppression de la machine du lieu', error);
      }
    );
  }

  // Update the filtered machine lists
  updateFilteredMachines(): void {
    if (!this.venue || !this.machines) {
      this.filteredMachinesToAdd = [];
      this.filteredMachinesToRemove = [];
      return;
    }

    const existingMachineIds = new Set(this.venue.machines.map((machine: any) => machine.id));

    // Machines not in the venue (for adding)
    this.filteredMachinesToAdd = this.machines.filter(machine => !existingMachineIds.has(machine.id));

    // Machines in the venue (for removing)
    this.filteredMachinesToRemove = this.machines.filter(machine => existingMachineIds.has(machine.id));
  }

  viewMachineDetails(id: string): void {
    this.router.navigate(['/machines', id]);
  }
}
