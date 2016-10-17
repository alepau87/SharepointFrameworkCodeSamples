import { IListItem } from './HellodataWebPart';

export default class MockHttpClient {
//Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn
    private static _items: IListItem[] =
    [
      { Title: 'Mock List', h7vv: '1',v7nw :'01-01-2016',mczsId:'Luis Esteban Valencia',BooleanColumn:'Yes' },
      { Title: 'Mock List2', h7vv: '1',v7nw :'01-01-2016',mczsId:'Luis Esteban Valencia',BooleanColumn:'Yes' },
    ];

    public static get(restUrl: string, options?: any): Promise<IListItem[]> {
      return new Promise<IListItem[]>((resolve) => {
              resolve(MockHttpClient._items);
          });
      }
}