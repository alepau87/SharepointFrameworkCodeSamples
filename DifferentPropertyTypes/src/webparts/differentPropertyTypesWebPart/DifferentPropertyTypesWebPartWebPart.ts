import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-client-preview';

  import styles from './DifferentPropertyTypesWebPart.module.scss';
  import * as strings from 'differentPropertyTypesWebPartStrings';
  import { IDifferentPropertyTypesWebPartWebPartProps } from './IDifferentPropertyTypesWebPartWebPartProps';

  export default class DifferentPropertyTypesWebPartWebPart extends BaseClientSideWebPart<IDifferentPropertyTypesWebPartWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.differentPropertyTypesWebPart}">
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
