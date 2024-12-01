import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {SearchService} from '../../../services/search-service';
import {MachineService} from '../../../services/machine-service';

@Component({
  standalone: true,
  selector: 'app-machine-details',
  templateUrl: 'machine-details.component.html',
  imports: [CommonModule, NgIcon]
})
export class MachineDetailsComponent implements OnInit {
  machine: any;
  loading: boolean = true; // État de chargement

  constructor(
    private machineService: MachineService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.setSearchVisibility(false);
    const id = this.route.snapshot.paramMap.get('id');
    this.machineService.getMachineById(id!).valueChanges.subscribe((result) => {
        this.machine = result.data.getMachine;
        this.loading = false; // Fin du chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de la machine', error);
        this.loading = false; // Fin du chargement même en cas d'erreur
      }
    );
  }

  viewVenueDetails(id: string): void {
    this.router.navigate(['/venues', id]);
  }
}
