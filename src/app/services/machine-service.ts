import {Injectable} from '@angular/core';
import {gql} from '@apollo/client';
import {Apollo, QueryRef} from 'apollo-angular';
import {Observable} from 'rxjs';

const GET_MACHINES = gql`
          {
            getAllMachines {
                id,
                name,
                type {
                    id,
                    name,
                    icon
                },
                manufacturer {
                    id,
                    name
                },
                venues {
                    id,
                    name,
                    city
                }
            }
          }
        `;

const GET_MACHINE = gql`
  query GetMachine($machineId: ID!) {
    getMachine(id: $machineId) {
      id,
      name,
      type {
        id,
        name,
        icon
      },
      manufacturer {
          id,
          name
      },
      venues {
          id,
          name,
          city
      }
    }
  }
`;

const CREATE_MACHINE = gql`
  mutation CreateMachine($name: String!, $typeId: ID!, $manufacturerId: ID!, $venueIds: [ID!]) {
    createMachine(
      name: $name,
      typeId: $typeId,
      manufacturerId: $manufacturerId,
      venueIds: $venueIds
    ) {
      id,
      name,
      type {
        id,
        name,
        icon
      },
      manufacturer {
        id,
        name
      },
      venues {
        id,
        name,
        city
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class MachineService {

  constructor(private readonly apollo: Apollo) {
  }

  getMachines(): QueryRef<unknown> {
    return this.apollo
      .watchQuery({
        query: GET_MACHINES,
      })
  }

  getMachineById(id: string): QueryRef<any, any> {
    return this.apollo
      .watchQuery({
        query: GET_MACHINE,
        variables: {
          machineId: id,
        },
      })
  }

  createMachine(machine: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_MACHINE,
      variables: {
        name: machine.name,
        typeId: machine.typeId,
        manufacturerId: machine.manufacturerId,
        venueIds: [],
        machineIds: []
      }});
  }
}
