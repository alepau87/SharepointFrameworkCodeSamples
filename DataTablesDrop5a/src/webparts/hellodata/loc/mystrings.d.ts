declare interface IHellodataStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListNameFieldLabel: string;
}

declare module 'hellodataStrings' {
  const strings: IHellodataStrings;
  export = strings;
}
