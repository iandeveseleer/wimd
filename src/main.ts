import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {inject, provideZoneChangeDetection} from '@angular/core';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import 'altcha';
import {provideApollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client';
import {provideIcons, provideNgIconLoader, withCaching} from '@ng-icons/core';
import {faSolidBeerMugEmpty} from '@ng-icons/font-awesome/solid';
import {
  bootstrapBullseye,
  bootstrapDashCircle,
  bootstrapInfoCircle,
  bootstrapPlusCircle
} from '@ng-icons/bootstrap-icons';
import {faFutbol} from '@ng-icons/font-awesome/regular';
import {environment} from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: `${environment.apiUrl}/graphql`}),
        cache: new InMemoryCache(),
      };
    }),
    provideRouter(routes),
    provideIcons({
      faSolidBeerMugEmpty,
      faFutbol,
      bootstrapInfoCircle,
      bootstrapPlusCircle,
      bootstrapDashCircle,
      bootstrapBullseye
    }),
    provideNgIconLoader(name => {
      const http = inject(HttpClient);
      return http.get(`assets/icons/${name}.svg`, { responseType: 'text' });
    }, withCaching()),
  ],
}).catch((err) => console.error(err));
