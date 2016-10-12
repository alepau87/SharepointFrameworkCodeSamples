#Validando propiedades del webpart en Sharepoint Framework

#####Panel de propiedades, reactivo vs no reactivo
Primero que todo como vimos en un post anterior, las propiedades que tenemos en el webpart a medida que las actualizamos se ven reflejadas en la funcionalidad del webpart en tiempo real, esto se llama el Reactive Property Pane, sin embargo en algunas ocasiones puede ser necesario desactivar esto.

Para hacerlo se agrega el siguiente codigo en la clase del webpart:
```TypeScript
protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
```

Al hacer esto, aparecera un boton para aplicar los cambios luego de editar los valores de las propiedades.

#####Agrupando propiedades en paginas y grupos

Las propiedades pueden ser agrupadas en paginas o grupos dentro de la misma pagina, a continuacion un ejemplo:
```TypeScript
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
                  label: "Digite el color"
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
```
![](http://www.luisevalencia.com/content/images/2016/09/7.png)

#####Validando los controles

Para validar los controles tenemos unas funciones callbacks que podemos declarar y luego asociar desde las propiedades, en mi caso el campo color debe ser un hexadecimal, es decir incluyendo el caracter #, debe ser de 7 caracteres, esto se implemento de la siguiente manera.


```TypeScript
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
                  label: 'This is the label',
                  onGetErrorMessage: this.validarCodigoHexadecimalColor,
                  //errorMessage: "Error",
                  deferredValidationTime: 500,
                  placeholder: "#FFFFFF",
                  "description": "Por favor ingrese un valor en hexadecimal"
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

private validarCodigoHexadecimalColor(value: string): string {
    if (value.length != 7 ) {
        return "Los codigos hexadecimales son de 7 caracteres incluyendo el signo #";
    } else {
      return "";
    }
  }
```

Y luego de aplicar los cambios, podemos ver un cambio en el fondo del webpart.

```TypeScript
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.validationsample}" style="background-color:${this.properties.color};">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row }">
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
```

![](http://www.luisevalencia.com/content/images/2016/09/8.png)

#####Validaciones con datos de Sharepoint

Ahora supongamos que necesitamos validar datos de Sharepoint, para este ejemplo he creado una propiedad para que el usuario digite el nombre de la lista, y debemos validar si esa lista existe.

Para esto debemos crear una interfaz de ISPLists y ISPList, esto en la parte superior de nuestra clase.

```TypeScript
export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}
```

Luego, debemos agregar una propiedad adicional para el nombre de la lista.

```TypeScript
 PropertyPaneTextField('nombreLista', {
                  label: 'Nombre Lista',
                  onGetErrorMessage: this._validarNombreLista.bind(this),
                  deferredValidationTime: 500,
                  placeholder: "Documents",
                  "description": "Por favor ingrese el nombre de la lista"
                })
```

Como pueden ver, en este codigo se hace llamado a una funcion para validar el nombre de la lista con un delay de 500ms, esto es para evitar que se llame al API muy frecuentemente.


```TypeScript
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
```

Ahora, debemos probar, debido a que el codigo anterior utiliza el contexto de Sharepoint no podemos probar localmente, debemos desplegar el paquete segun explicamos en uno de nuestros posts anteriores.

El resultado visual es el siguiente:

![](http://www.luisevalencia.com/content/images/2016/09/9-1.png)