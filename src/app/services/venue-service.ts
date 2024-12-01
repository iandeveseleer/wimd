import {Injectable} from '@angular/core';
import {gql} from '@apollo/client';
import {Apollo, QueryRef} from 'apollo-angular';
import {Observable} from 'rxjs';

const GET_VENUES = gql`
          {
            getAllVenues {
                id,
                name,
                streetNumber,
                street,
                zipCode,
                city,
                country,
                machineIds,
                venueType {
                  name,
                  icon
                }
            }
          }
        `;

const GET_VENUE = gql`
  query GetVenue($venueId: ID!) {
    getVenue(id: $venueId) {
      id,
      name,
      streetNumber,
      street,
      zipCode,
      city,
      country,
      machines {
          id,
          name,
          type {
              name
          },
          manufacturer {
              name
          }
      },
      venueType {
        name,
        icon
      }
    }
  }
`;

const CREATE_VENUE_MUTATION = gql`
      mutation CreateVenue($name: String!, $venueTypeId: ID!, $city: String!, $country: String!, $street: String!, $streetNumber: String!, $zipCode: String!, $machineIds: [ID!]) {
        createVenue(
          name: $name,
          venueTypeId: $venueTypeId,
          streetNumber: $streetNumber,
          street: $street,
          zipCode: $zipCode,
          city: $city,
          country: $country,
          machineIds: $machineIds
        ) {
          id
          name
          venueTypeId
          streetNumber
          street
          zipCode
          city
          country
          machineIds
        }
      }
    `;

const ADD_MACHINE_MUTATION = gql`
  mutation ($venueId: String!, $machineId: String!) {
    addMachineToVenue(venueId: $venueId, machineId: $machineId) {
      id
      name,
      streetNumber,
      street,
      zipCode,
      city,
      country,
      machineIds,
      venueType {
        name,
        icon
      }
      machines {
        id
        name
        manufacturer {
          name
        }
      }
    }
  }
`;

const REMOVE_MACHINE_MUTATION = gql`
  mutation ($venueId: String!, $machineId: String!) {
    removeMachineFromVenue(venueId: $venueId, machineId: $machineId) {
      id
      name,
      streetNumber,
      street,
      zipCode,
      city,
      country,
      machineIds,
      venueType {
        name
      }
      machines {
        id
        name
        manufacturer {
          name
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VenueService {

  constructor(private readonly apollo: Apollo) {
  }

  getVenues(): QueryRef<unknown> {
    return this.apollo
      .watchQuery({
        query: GET_VENUES,
      })
  }

  getVenueById(id: string): QueryRef<any, any> {
    return this.apollo
      .watchQuery({
        query: GET_VENUE,
        variables: {
          venueId: id,
        },
      })
  }

  createVenue(venue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_VENUE_MUTATION,
      variables: {
        name: venue.name,
        venueTypeId: venue.venueTypeId,
        streetNumber: venue.streetNumber,
        street: venue.street,
        zipCode: venue.zipCode,
        city: venue.city,
        country: venue.country,
        machineIds: []
      }});
  }

  // Add a machine to a venue
  addMachineToVenue(venueId: string, machineId: string) {
    return this.apollo.mutate({
      mutation: ADD_MACHINE_MUTATION,
      variables: { venueId, machineId },
    });
  }

  // Remove a machine from a venue
  removeMachineFromVenue(venueId: string, machineId: string) {
    return this.apollo.mutate({
      mutation: REMOVE_MACHINE_MUTATION,
      variables: { venueId, machineId },
    });
  }
}
