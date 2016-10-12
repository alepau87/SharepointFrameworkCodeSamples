import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-client-preview';

import styles from './Validationsample.module.scss';
import * as strings from 'validationsampleStrings';
import { IValidationsampleWebPartProps } from './IValidationsampleWebPartProps';

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}

export default class ValidationsampleWebPart extends BaseClientSideWebPart<IValidationsampleWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  private validarCodigoHexadecimalColor(value: string): string {
    if (value.length != 7 ) {
        return "Los codigos hexadecimales son de 7 caracteres incluyendo el signo #";
    } else {
      return "";
    }
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.validationsample}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
              <a href="https://github.com/SharePoint/sp-dev-docs/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

  private fetchLists(url: string) : Promise<ISPLists> {
    return this.context.httpClient.get(url).then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
          return null;
        }
      });
  }

  private _validarNombreLista(value: string): Promise<string> {
      console.log(`_validarNombreLista function fired at ${new Date().toTimeString()}`);

    if (value !== undefined && value.length > 3) {
      var url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`;

      return this.fetchLists(url).then((response) => {
          var lists: ISPList[] = response.value;
          var foundList: boolean = false;
          lists.forEach((list: ISPList) => {
              if (value === list.Title) {
                  foundList = true;
              }
          });

          if (!foundList) {
            // resolve promise with error message to display..
            //return Promise.resolve("Value entered did not match a list in this site!");
            console.log(`La lista no se ha encontrado ${new Date().toTimeString()}`);
           return "La lista no se ha encontrado";
          }

          // otherwise do nothing - note we don't need to reject the promise..
        });
      }
  }

 protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: "Pagina 1"
          },
          groups: [
            {
              groupName: "Tema",
              groupFields: [
                PropertyPaneTextField('tema', {
                  label: "Digite el tema"
                }),
                PropertyPaneTextField('color', {
                  label: "Digite el color",
                   onGetErrorMessage: this.validarCodigoHexadecimalColor,
                  //errorMessage: "Error",
                  deferredValidationTime: 500,
                  placeholder: "#FFFFFF",
                  "description": "Por favor ingrese un valor en hexadecimal"
                }),
                PropertyPaneTextField('nombreLista', {
                  label: 'Nombre Lista',
                  onGetErrorMessage: this._validarNombreLista.bind(this),
                  deferredValidationTime: 500,
                  placeholder: "Documents",
                  "description": "Por favor ingrese el nombre de la lista"
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "Pagina 2"
          },
          groups: [
            {
              groupName: "Configuracion de la busqueda",
              groupFields: [
                PropertyPaneTextField('textoBusqueda', {
                  label: "Texto Busqueda"
                }),
                PropertyPaneDropdown('tipoResultados', {
                  label: "Tipo de resultados",
                  options: [
                    { key: 'Fotos', text: 'Fotos' },
                    { key: 'Documentos', text: 'Documentos' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
