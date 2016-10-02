import { BaseClientSideWebPart, IPropertyPaneSettings, IWebPartContext } from '@microsoft/sp-client-preview';
import { ILibrarysampleWebPartProps } from './ILibrarysampleWebPartProps';
export default class LibrarysampleWebPart extends BaseClientSideWebPart<ILibrarysampleWebPartProps> {
    constructor(context: IWebPartContext);
    render(): void;
    protected propertyPaneSettings: IPropertyPaneSettings;
}
