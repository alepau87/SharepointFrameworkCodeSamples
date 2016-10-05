#Diferentes tipos de propiedades en Sharepoint Framework

Este articulo, se refiere al blog post [aqui](http://www.luisevalencia.com/2016/09/11/diferentes-tipos-de-propiedades-en-sharepoint-framework/)

En nuestro post anterior hemos creado un simple webpart SPF, con campos de texto solamente, la descripción y 2 posibles numeros para realizar una simple suma.

Sin embargo, en la vida real, necesitamos más cosas, como checkbox, dropdown, toggle, múltiples líneas, etc.

En esta sección, te voy a mostrar el código para agregar estas propiedades al código, en las secciones futuras vamos a mostrar cómo crear controles personalizados como datepickers, etc.

###### Panel de propiedades de elementos Web

El panel de propiedades se define en la propiedad propertyPaneSettings :

Una vez que las propiedades se definen, a continuación, puede acceder a ellos en su webpart utilizando this.properties.<Property-value>, justo como hicimos en el metodo render del post anterior

```TypeScript
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
            PropertyPaneTextField('Name', {
              label: 'Name'
            }),
            PropertyPaneTextField('Bio', {
              label: 'Multi-line Text Field',
              multiline: true
            }),
            PropertyPaneCheckbox('SPDeveloper', {
              text: 'Are you a sharepoint developer'
            }),
            PropertyPaneDropdown('LoveSP', {
              label: 'How much do you love sharepoint?',
              options: [
                { key: 'Too Much', text: 'Too Much' },
                { key: 'Not Much', text: 'Not Much' },
                { key: 'Almost Hate it', text: 'Almost Hate it' },
                { key: 'Definitely Hate it', text: 'Definitely Hate it' }
              ]}),
            PropertyPaneToggle('ReceiveEmails', {
              label: 'Do you want to receive emails?',
              onText: 'On',
              offText: 'Off'
            })
          ]
          }
        ]
      }
    ]
  };
```

Aquí definimos las propiedades de tipo: línea múltiple, un checkbox, un dropdown , y también el Toggle (booleano).

Sin embargo, esto no es suficiente, necesitamos importar estas propiedades desde el SPF, estos se encuentran en la parte superior del archivo:

```TypeScript
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';
```

Ahora tenemos que añadir los tipos de las propiedades al archivo IOurFirstSpfAppWebPartProps:

```TypeScript
export interface IPropertiesSampleWebPartProps {
    Name: string;
    Bio: string;
    SPDeveloper: boolean;
    LoveSP: string;
    ReceiveEmails: boolean;
}
```


Volvemos al archivo principal, en el método render, podemos acceder a las nuevas propiedades de la misma manera:


```TypeScript
{this.properties.yourpropertynamehere}
```

Las propiedades también pueden tener valores por defecto, estos valores por defecto se definen en el archivo manifest.json como esto:

```JSON
 "properties": {
        "Name": "PropertiesSample",
        "Bio": "Multi-line text field",
        "SPDeveloper": true,
        "LoveSP": "2",
        "ReceiveEmails": true
    }
```
###### El manifiesto del webpart

El manifest.json define las propiedades del elemento Web, este es el codigo completo del manifest.json.

```TypeScript
{
  "$schema": "../../../node_modules/@microsoft/sp-module-interfaces/lib/manifestSchemas/jsonSchemas/clientSideComponentManifestSchema.json",

  "id": "f61b54d7-9e1d-45f7-aaa8-e8c0982aefdc",
  "componentType": "WebPart",
  "version": "0.0.1",
  "manifestVersion": 2,

  "preconfiguredEntries": [{
    "groupId": "f61b54d7-9e1d-45f7-aaa8-e8c0982aefdc",
    "group": { "default": "Under Development" },
    "title": { "default": "PropertiesSample" },
    "description": { "default": "PropertiesSample description" },
    "officeFabricIconFontName": "Page",
    "properties": {
        "Name": "PropertiesSample",
        "Bio": "Multi-line text field",
        "SPDeveloper": true,
        "LoveSP": "2",
        "ReceiveEmails": true
    }
  }]
}

```

Y, finalmente, todo el código de los archivos más importantes PropertiesSampleWebPart.ts:
```TypeScript
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';


import styles from './PropertiesSample.module.scss';
import * as strings from 'propertiesSampleStrings';
import { IPropertiesSampleWebPartProps } from './IPropertiesSampleWebPartProps';

export default class PropertiesSampleWebPart extends BaseClientSideWebPart<IPropertiesSampleWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.propertiesSample}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Sharepoint Questionnaire!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">Name: ${this.properties.Name}</p>
              <p class="ms-font-l ms-fontColor-white">Bio: ${this.properties.Bio}</p>
              <p class="ms-font-l ms-fontColor-white">Are you a Sharepoint Developer: ${this.properties.SPDeveloper}</p>
              <p class="ms-font-l ms-fontColor-white">How much you love Sharepoint: ${this.properties.LoveSP}</p>
              <p class="ms-font-l ms-fontColor-white">Do you want to receive emails: ${this.properties.ReceiveEmails}</p>
              <a href="https://github.com/SharePoint/sp-dev-docs/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

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
            PropertyPaneTextField('Name', {
              label: 'Name'
            }),
            PropertyPaneTextField('Bio', {
              label: 'Multi-line Text Field',
              multiline: true
            }),
            PropertyPaneCheckbox('SPDeveloper', {
              text: 'Are you a sharepoint developer'
            }),
            PropertyPaneDropdown('LoveSP', {
              label: 'How much do you love sharepoint?',
              options: [
                { key: 'Too Much', text: 'Too Much' },
                { key: 'Not Much', text: 'Not Much' },
                { key: 'Almost Hate it', text: 'Almost Hate it' },
                { key: 'Definitely Hate it', text: 'Definitely Hate it' }
              ]}),
            PropertyPaneToggle('ReceiveEmails', {
              label: 'Do you want to receive emails?',
              onText: 'On',
              offText: 'Off'
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

#####Resultado final

![](/Content/images/2016/09/2016-09-10_19-42-04.png)

