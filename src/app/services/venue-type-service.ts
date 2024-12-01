import {Injectable} from '@angular/core';
import {gql} from '@apollo/client';
import {Apollo, QueryRef} from 'apollo-angular';

const GET_VENUE_TYPES = gql`
          {
            getAllVenueTypes {
                id,
                name,
                icon,
                venueIds
            }
          }
        `;

const GET_VENUE_TYPE = gql`
  query GetVenueType($venueTypeId: ID!) {
    getVenueType(id: $venueTypeId) {
      id,
      name,
      icon,
      venues {
          id,
          name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VenueTypeService {

  constructor(private readonly apollo: Apollo) {
  }

  getVenueTypes(): QueryRef<unknown> {
    return this.apollo
      .watchQuery({
        query: GET_VENUE_TYPES,
      })
  }

  getVenueTypeById(id: string): QueryRef<any, any> {
    return this.apollo
      .watchQuery({
        query: GET_VENUE_TYPE,
        variables: {
          venueTypeId: id,
        },
      })
  }
}
