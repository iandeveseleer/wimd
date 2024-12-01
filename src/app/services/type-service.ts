import {Injectable} from "@angular/core";
import {gql} from '@apollo/client';
import {Apollo, QueryRef} from 'apollo-angular';

const GET_TYPES = gql`
          {
            getAllTypes {
              id,
              name,
              machines {
                id,
                name,
                manufacturer {
                    name
                }
              }
            }
          }
        `;

const GET_TYPE = gql`
  query GetType($typeId: ID!) {
    getType(id: $typeId) {
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

@Injectable({
  providedIn: 'root',
})
export class TypeService {

  constructor(private readonly apollo: Apollo) {
  }

  getTypes(): QueryRef<unknown> {
    return this.apollo
      .watchQuery({
        query: GET_TYPES,
      })
  }

  getTypeById(id: string): QueryRef<any, any> {
    return this.apollo
      .watchQuery({
        query: GET_TYPE,
        variables: {
          typeId: id,
        },
      })
  }
}
