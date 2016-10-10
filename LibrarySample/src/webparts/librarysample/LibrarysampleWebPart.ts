import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

import * as strings from 'librarysampleStrings';
import Librarysample, { ILibrarysampleProps } from './components/Librarysample';
import { ILibrarysampleWebPartProps } from './ILibrarysampleWebPartProps';
import * as calculator from 'calculator';

export default class LibrarysampleWebPart extends BaseClientSideWebPart<ILibrarysampleWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    const element: React.ReactElement<ILibrarysampleProps> = React.createElement(Librarysample, {
      description: this.properties.description
    });
    
    var easycalc = new calculator.EasyCalculator();
    var result = easycalc.sum(1,2);
    console.log(result);
    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
