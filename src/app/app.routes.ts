import {Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {VenueDetailsComponent} from './views/venues/venue-details/venue-details.component';
import {MachineDetailsComponent} from './views/machines/machine-details/machine-details.component';
import {VenuesComponent} from './views/venues/venues.component';
import {MachinesComponent} from './views/machines/machines.component';
import {ManufacturersComponent} from './views/manufacturers/manufacturers.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'venues', component: VenuesComponent},
  {path: 'venues/:id', component: VenueDetailsComponent},
  {path: 'machines', component: MachinesComponent},
  {path: 'machines/:id', component: MachineDetailsComponent},
  {path: 'manufacturers', component: ManufacturersComponent}
]
