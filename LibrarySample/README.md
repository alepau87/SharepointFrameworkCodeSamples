Este codigo esta basado en mi blog post, que por facilidad tambien lo puedes leer [aqui](http://www.luisevalencia.com/2016/09/24/como-crear-librerias-reutilizables-para-proyectos-sharepoint-framework/)

Para nosotros los desarrolladores es muy comun reutilizar codigo, en algunas de nuestras empresas ya tienen librerias que nos obligan a reutilizar, en otras utilizamos librerias comerciales, pero a a la final entre mas codigo reutilizemos mas facil es terminar nuestros proyectos.

Con Sharepoint Framework esto no es una excepcion imagina que tienes un proyecto SPF donde debes crear 100 webparts y muchos utilizan el mismo codigo para guardar, eliminar, insertar o editar.

Con la manera tradicional de desarrollar este codigo queda embebido en cada webpart, por lo cual hay una penalidad de rendimiento ya que en cada webpart se esta descargando codigo que podria ser comun a todos.

##Separando el codigo de los webparts
Para esto hay dos maneras, cada una con sus beneficios.

####Crear un paquete separado
Podriamos utilizar un paquete completamente separado al proyecto webpart, es mas este codigo nisiquiera tiene que utilizar el yoman para generar la plantilla de tipo SPF, se publicaria en un CDN por ejemplo y el ciclo de vida de desarrollo de este paquete no tendria nada que ver con los webparts que lo consumen

####Codigo compartido como una libreria dentro del mismo proyecto

Con Sharepoint Framework podemos crear webparts, pero tambien librerias, asi como en un post anterior definimos como crear 2 webparts, tambien podemos crear librerias con codigo que podamos utilizar desde varios webparts del mismo proyecto.

#####Como crear una libreria

Para esto creamos la carpeta libraries dentro de src, en nuestro caso vamos a crear una calculadora sencilla, solo para que se entienda el modo de hacer e invocar librerias.

![](/content/images/2016/09/1-2.png)

Ahora debemos agregar nuestras clases y el manifiesto.

EasyCalculator.ts
```TypeScript
export class EasyCalculator {
  public sum(v1: number, v2: number): number {
    return v1 + v2;
  }

  public subtraction(v1: number, v2: number): number {
    return v1 - v2;
  }
}
```

ComplexCalculator.ts
```TypeScript
export class ComplexCalculator {
  public sqr(v1: number): number {
    return v1*v1;
  }
}
```

Calculator.ts
```TypeScript
export * from './ComplexCalculator';
export * from './EasyCalculator';
```

Recuerda generar un guid

```json
{
  "$schema": "../../../node_modules/@microsoft/sp-module-interfaces/lib/manifestSchemas/jsonSchemas/clientSideComponentManifestSchema.json",

  "id": "8de800b0-6a4f-4cb0-bf75-62c32e6ea66b",
  "componentType": "Library",
  "version": "0.0.1",
  "manifestVersion": 2
}
```
Ahora necesitamos registrar la libreria, esto lo hacemos en la carpeta config, en el archivo config.json

```json
  "entries": [
    {
      "entry": "./lib/webparts/librarysample/LibrarysampleWebPart.js",
      "manifest": "./src/webparts/librarysample/LibrarysampleWebPart.manifest.json",
      "outputPath": "./dist/librarysample.bundle.js"
    },
     {
      "entry": "./lib/libraries/calculator/Calculator.js",
      "manifest": "./src/libraries/calculator/Calculator.manifest.json",
      "outputPath": "./dist/calculator.bundle.js"
    }
```

La estructura final es:


![](/content/images/2016/09/2-2.png)

Para verificar que todo funciona correctamente, ejecutamos:
```
gulp bundle
```

Si todo funciona correctamente podremos ver en la carpeta dist algo como esto:


####Utilizando la libreria desde el webpart
Para esto solo debemos agregar a la clase del webpart una linea para importar.

```TypeScript
import * as calculator from '../../libraries/calculator/calculator';
```

Pero esto tiene una desventaja, el codigo de la libreria seria incluido en el bundle del webpart, y eso no es lo que queremos

#####Registrando la libreria como un componente externo

Como nuestro codigo es compilado en un bundle separado, podemos registrarlo en el proyecto como un script externo, para eso registramos el Calculator bundle , en el config.json en el arreglo de externals.

```json
  "externals": {
    "@microsoft/sp-client-base": "node_modules/@microsoft/sp-client-base/dist/sp-client-base.js",
    "@microsoft/sp-client-preview": "node_modules/@microsoft/sp-client-preview/dist/sp-client-preview.js",
    "@microsoft/sp-lodash-subset": "node_modules/@microsoft/sp-lodash-subset/dist/sp-lodash-subset.js",
    "office-ui-fabric-react": "node_modules/office-ui-fabric-react/dist/office-ui-fabric-react.js",
    "react": "node_modules/react/dist/react.min.js",
    "react-dom": "node_modules/react-dom/dist/react-dom.min.js",
    "react-dom/server": "node_modules/react-dom/dist/react-dom-server.min.js",
    "calculator": ".dist/calculator.bundle.js"
  },
```

#####Referenciando la libreria desde el webpart

Normalmente con esta linea seria suficiente
```TypeScript
import * as calculator from 'calculator';
```

Sin embargo esto generaria el siguiente error:
![](/content/images/2016/09/3-3.png)


Para esto debemos generar los typings de nustros typescript, esto se puede hacer manualmente agregando un archivo de nombre calculator.d.ts con cun codigo mas o menos asi:

```TypeScript
declare module 'calculator' {  
  class EasyCalculator {
      sum(v1: number, v2: number): number;
      subtraction(v1: number, v2: number): number
  }

  class ComplexCalculator {
      sqr(v1: number): number;
  }
}
```
Ahora, el proyecto compila correctamente

![](/content/images/2016/09/4-2.png)

####Generando automaticamente los typings.
El problema con lo explicado anteriormente es que cada vez que creemos nuevos metodos en nuestras calses, o las firmas de los metodos cambien, tendriamos que cambiar el archivo de typings, lo que es bastante demorado, sin embargo con algunos paquetes podriamos hacerlo automaticamente.

Para eso instalemos los siguientes paquetes:
```
npm i gulp-clean gulp-typescript gulp-util through2 -D
```

Ahora debemos configurar nuestro proceso de compilacion, para eso utilizamos el archivo gulpfile.js

Codigo cortesia de Waldek Mastykarz en [github](https://github.com/waldekmastykarz/spfx-sample-dllcode/blob/master/gulpfile.js)


```javascript
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
var through = require('through2'),
    util = require('gulp-util'),
    spawn = require('child_process').spawn,
    clean = require('gulp-clean'),
    ts = require('gulp-typescript');

build.initialize(gulp);

var libsPath = 'lib/libraries';
var srcPath = 'src/libraries';
var calculatorLibraryFolder = 'calculator';

gulp.task('watch-calculator-lib', (cb) => {
  var watcher = gulp.watch(`${srcPath}/${calculatorLibraryFolder}/**/*.ts`, ['update-calculator-typings']);
  watcher.on('change', (event) => {
    console.log(`File ${event.path} was ${event.type}, Rebuilding library typings...`);
  });
});

gulp.task('update-calculator-typings', [
  'update-calculator-typings:clean-old-typings',
  'update-calculator-typings:get-latest-typings',
  'update-calculator-typings:build-lib-typings'
], () => {
});

gulp.task('update-calculator-typings:clean-old-typings', () => {
  return gulp.src(`${libsPath}/${calculatorLibraryFolder}/**`, { read: false })
    .pipe(clean());
});

gulp.task('update-calculator-typings:get-latest-typings', ['update-calculator-typings:clean-old-typings'], () => {
  var tsResult = gulp.src(`${srcPath}/${calculatorLibraryFolder}/**/*.ts`)
    .pipe(ts({
      outDir: `${libsPath}/${calculatorLibraryFolder}`,
      module: 'umd',
      declaration: true
    }));
  return tsResult.dts.pipe(gulp.dest(`${libsPath}/${calculatorLibraryFolder}`));
});

gulp.task('update-calculator-typings:build-lib-typings', ['update-calculator-typings:get-latest-typings'], () => {
  return gulp.src(`${libsPath}/${calculatorLibraryFolder}/**/*.d.ts`)
    .pipe(updateLibTypings('calculator.d.ts'))
    .pipe(gulp.dest('./typings'));
});

var updateLibTypings = function (typingsFilePath, opt) {
  var typings = ["declare module 'calculator' {"];
  var latestFile;

  function processTypings(file, encoding, cb) {
    if (file.isNull() || file.isStream()) {
      cb();
      return;
    }

    latestFile = file;

    var contents = file.contents.toString('utf8');
    if (contents.indexOf('export declare class ') === -1) {
      cb();
      return;
    }

    contents = contents.replace('export declare class ', 'class ');
    typings.push(contents);
    cb();
  }

  function endStream(cb) {
    if (!latestFile) {
      cb();
      return;
    }

    typings.push('}');

    var file = latestFile.clone({ contents: false });
    file.path = latestFile.base + typingsFilePath;
    file.contents = new Buffer(typings.join('\r\n'));
    this.push(file)
    cb();
  }

  return through.obj(processTypings, endStream);
}
```

Ahora en la consola de vs code podemos ejecutar el siguiente comando:
```
gulp watch-calculator-lib  
```

Ahora cada vez que cambiemos una clase, el archivo de typings se generara automaticamente.
![](/content/images/2016/09/5-2.png)

And finally on the typings folder on file tsd.d.ts we have to add a reference

```javascript
/// <reference path="calculator.d.ts" />
```