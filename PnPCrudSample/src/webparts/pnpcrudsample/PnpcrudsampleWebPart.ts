/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/jquery.dataTables/jquery.dataTables.d.ts" />

import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

//import styles from './Pnpcrudsample.module.scss';
import ModuleLoader from '@microsoft/sp-module-loader';
import * as strings from 'pnpcrudsampleStrings';
import { IPnpcrudsampleWebPartProps } from './IPnpcrudsampleWebPartProps';
import * as pnp from 'sp-pnp-js';

require('jquery');
require('datatables');

interface IListItem {
  Title?: string;
  Id: number;
}

export default class PnpcrudsampleWebPart extends BaseClientSideWebPart<IPnpcrudsampleWebPartProps> {
   private container: JQuery;

  //Default constructor, here we have to load css
  public constructor(context: IWebPartContext) {
    super(context);
    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
  }

  /// Generar contenido HTML
  public render(): void {
    const webPart: PnpcrudsampleWebPart = this;
    //webPart.readItems();
    debugger;

    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
    if (this.renderedOnce === false) {
      //this.domElement.innerHTML = `<div class="${styles.weather}"></div>`;
    }

    this.renderContents();
  }

  private renderContents(): void {
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
        <tfoot>
            <tr>
                <th>Title</th>
                <th>NumberColumn</th>
                <th>DateColumn</th>
                <th>PersonColumn</th>
                <th>BooleanColumn</th>
            </tr>
        </tfoot>
    </table>`;
  }

  //Property pane fields
  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }


  //Update item status
  private updateStatus(status: string, items: IListItem[] = []): void {
    this.domElement.querySelector('.status').innerHTML = status;
    this.updateItemsHtml(items);
  }

  //Read items from list
  private readItems(): void {
    debugger;
    this.updateStatus('Loading all items...');
    pnp.sp.web.lists.getByTitle(this.properties.listName)
      .items.select('Title', 'Id').get()
      .then((items: IListItem[]): void => {
        this.updateStatus(`Successfully loaded ${items.length} items`, items);
         $(document).ready(() => {
          $('#example').DataTable( {
            data: items,
            columns: [
                { title: "Title" },
                { title: "NumberColumn" },
                { title: "DateColumn" },
                { title: "PersonColumn" },
                { title: "BooleanColumn" }
            ]
          });
        });
      }, (error: any): void => {
        this.updateStatus('Loading all items failed with error: ' + error);
      });
  }

  //Update html elements
  private updateItemsHtml(items: IListItem[]): void {
    const itemsHtml: string[] = [];
    for (let i: number = 0; i < items.length; i++) {
      itemsHtml.push(`<li>${items[i].Title} (${items[i].Id})</li>`);
    }

    this.domElement.querySelector('.items').innerHTML = itemsHtml.join('');
  }
}
