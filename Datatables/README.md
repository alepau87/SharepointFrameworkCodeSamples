In this post I will explain how to integrate the plugin DataTables into SPF to show data like a gridview, this plugin is awesome because it allows you to paginate async, search async/on screen, and it has very good looking style.  We could even use this as replacement for the standard sharepoint list view webpart.  I dont understand why after so many years the list view webpart is so ugly and slow, perhaps with the modern sites coming soon, this will look better and be faster.


As you know testing REST API calls to Sharepoint its not possible from the local computer, so in order to do that we need to create a Mock to hardcode results locally and test in our workbench, and then test on our Sharepoint Site.

######MockHttpClient.ts
```Typescript
import { IListItem } from './PnpcrudSampleWebPart';

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
```

When I created my list, I added some columns with names: datecolumn, personcolumn, however sharepoint added the internal names that you see in the json hardcoded above.


In our webpart code we have to check if we are working locally or in the server, thats why we added the MockClient
```Typescript
 private _renderListAsync(): void {
    // Local environment
    if (this.context.environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    }
    else{
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }
```

As you can see if its local it calls the MockHttpClient, if its not local it calls another method which actually makes the api call as shown below:
```typescript
  private _getListData(): Promise<IListItems> {
    return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Lista')/items?$select=Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn`)
      .then((response: Response) => {
        return response.json();
      });
  }
```


As you know the entry point of every webpart is the render method, thats why here we add our html for the table, and then call the async method
```typescript
  public render(): void {
    debugger;
    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
    if (this.renderedOnce === false) {
       this.domElement.innerHTML = `<table id="example" class="display" cellspacing="0" width="100%">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>NumberColumn</th>
                    <th>DateColumn</th>
                    <th>PersonColumn</th>
                    <th>BooleanColumn</th>
                </tr>
            </thead>
        </table>`;
    }
   this._renderListAsync();
  }
```

and our renderlist method which actually calls the datatables plugin to render the json data on screen:

```typescript
  ///Render list on the datatable
  private _renderList(items: IListItem[]): void {
    $('#example').DataTable({
      data: items,
      columns: [
          { "data": "Title" },
          { "data": "h7vv" },//just the columnd names sharepoint generated.
          { "data": "v7nw" },
          { "data": "mczsId" },
          { "data": "BooleanColumn" }
      ]
    });
  }
```


The end result: a very good looking grid, which I can sort, paginate, and even search faster than what a Sharepoint Listview allows us.


Full code [here](https://github.com/levalencia/SharepointFrameworkCodeSamples/tree/master/Datatables)

![](/content/images/2016/10/2016-10-15_18-44-19.png)