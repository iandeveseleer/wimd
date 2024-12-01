import {Injectable} from "@angular/core";
import {Apollo, QueryRef} from 'apollo-angular';
import {gql} from '@apollo/client';
import {Observable} from 'rxjs';

const GET_MANUFACTURERS = gql`
          {
            getAllManufacturers {
                id,
                name,
                machineIds
            }
          }
        `;

const GET_MANUFACTURER = gql`
  query GetManufacturer($manufacturerId: ID!) {
    getManufacturer(id: $manufacturerId) {
      id,
      name,
      machines {
          id,
          name,
          type {
              name
          },
          manufacturer {
              name
          }
      }
    }
  }
`;

const CREATE_MANUFACTURER = gql`
  mutation CreateManufacturer($name: String!, $machineIds: [ID!]) {
    createManufacturer(
      name: $name,
      machineIds: $machineIds
    ) {
      id
      name
      machineIds
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {

  constructor(private readonly apollo: Apollo) {
  }

  getManufacturers(): QueryRef<unknown> {
    return this.apollo
      .watchQuery({
        query: GET_MANUFACTURERS,
      })
  }

  getManufacturerById(id: string): QueryRef<any, any> {
    return this.apollo
      .watchQuery({
        query: GET_MANUFACTURER,
        variables: {
          manufacturerId: id,
        },
      })
  }

  createManufacturer(manufacturer: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_MANUFACTURER,
      variables: {
        name: manufacturer.name,
        machineIds: []
      }});
  }
}
