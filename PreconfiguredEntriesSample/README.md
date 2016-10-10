#Para que sirve el preconfigured entries en Sharepoint Framework y un ejemplo

Un webpart en Sharepoint Framework consiste en dos partes importantes, el manifest.json que define las propiedades del webpart y el codigo del webpart en el archivo de TypeScript.

De esta manera podriamos utilizar el mismo codigo del webpart, pero para el usuario final apareceria como 2 webparts diferentes.

Para esto, agregamos en el preconfigured entries, las propiedades del webpart una segunda vez con los valores deseados, en mi caso, simplemente la descripcion tiene otro valor.

El codigo es muy facil, simplemente copia el configured entries:
```json
{
  "$schema": "../../../node_modules/@microsoft/sp-module-interfaces/lib/manifestSchemas/jsonSchemas/clientSideComponentManifestSchema.json",

  "id": "25232731-23c8-4329-9013-8ad4cfea8630",
  "componentType": "WebPart",
  "version": "0.0.1",
  "manifestVersion": 2,

  "preconfiguredEntries": [
  {
    "groupId": "25232731-23c8-4329-9013-8ad4cfea8630",
    "group": { "default": "Under Development 1" },
    "title": { "default": "Webpart number 1" },
    "description": { "default": "preconfiguredentiessample description" },
    "officeFabricIconFontName": "Page",
    "properties": {
      "description": "VALUE1"
    }
  },
  {
    "groupId": "25232731-23c8-4329-9013-8ad4cfea8630",
    "group": { "default": "Under Development 2" },
    "title": { "default": "Webpart number 2" },
    "description": { "default": "preconfiguredentiessample description" },
    "officeFabricIconFontName": "Page",
    "properties": {
      "description": "VALUE2"
    }
  }]
}
```

Y el resultado final, mismo webpart, instancias diferentes, code reuse ftw!


![](http://www.luisevalencia.com/content/images/2016/10/12.png)

