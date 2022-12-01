# Gentics UI Core

This is the common core framework for the Gentics CMS and Mesh UI, and other Angular applications.

Gentics UI Core 7.8.0 and up supports Angular 7 and 8.

## Using ui-core in a project

1. Install via npm:
```
npm install gentics-ui-core --save
```
Note that npm will say that the `foundation-sites` package, which is a dependency of UI Core, requires a peer dependency of `jquery` and `what-input`. For the usage of foundation-sites within gentics-ui-core these peer dependencies are not needed.

2. Import the module and add it to your app's root module:

```TypeScript
// app.module.ts
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';

@NgModule({
    // ...
    imports: [
        FormsModule,
        GenticsUICoreModule.forRoot(),
        ReactiveFormsModule
    ]
}
export class AppModule { }
```

3. Add the [`<gtx-overlay-host>`](https://gentics.github.io/gentics-ui-core/#/overlay-host) component to your AppComponent's template if you want to use components that have overlay parts:

```HTML
<!-- app.component.html -->
<!-- ... -->
<gtx-overlay-host></gtx-overlay-host>
```

4. Set ```preserveWhitespaces``` to ```true``` in your ```tsconfig.json``` or ```tsconfig.app.json```.
This is necessary for the default spacing between components.

```JSON
{
    ...
    "angularCompilerOptions": {
        "preserveWhitespaces": true
    },
    ...
}
```

5. In your ```main.ts``` file enable preservation of whitespaces in the call to ```bootstrapModule()```:

```TypeScript
// main.ts
platformBrowserDynamic().bootstrapModule(AppModule, 
  // Enable preservation of whitespaces for default spacing between components.
  { preserveWhitespaces: true }
).catch(err => console.error(err));
```

## View Encapsulation

Do not use any ViewEncapsulation other than `ViewEncapsulation.None` (which is the default), because some UI Core components use the CSS `::ng-deep` selector.

## Lazy Loading of Routes

If you are using [lazy loading of routes](https://angular.io/guide/lazy-loading-ngmodules),  the singleton services need to be provided again in the lazily loaded module, because otherwise they will not be found. For example:

```TypeScript
// my-lazily-loaded.module.ts
// ...
@NgModule({
    // ...
    providers: [
        ModalService,
        OverlayHostService
        // ...
    ]
})
export class MyLazilyLoadedModule {
    // ...
}
```

## Using ui-core in an [angular-cli](https://cli.angular.io/) project

1. Create a new app using angular-cli (this guide assumes angular-cli version 8.x). The following command will create a new app with the name `my-example` in the folder `./my-example`, use `me` as the prefix for components, set up a routing module, and use SCSS for defining styles. Please note that while a custom prefix and the routing module are optional, SCSS must be used for the styles in order to be compatible with Gentics UI Core.

```
ng new my-example --prefix=me --routing=true --style=scss
```

2. Uncomment (and if necessary, install) the polyfills required for your target browsers in `polyfills.ts`.
Note that the [SideMenu](https://gentics.github.io/gentics-ui-core/#/side-menu) requires the `web-animations-js` polyfill in IE, Edge, and Safari: 

```TypeScript
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
// Polyfills required by your target browsers.
// ...

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
import 'web-animations-js';  // Run `npm install --save web-animations-js`.
```

3. Add the following assignment to `polyfills.ts`:

```TypeScript
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
// This is necessary, because GUIC uses the Intl library, which requires a global object (like in Node.js).
(window as any).global = window;
```

4. Follow the steps from [Using ui-core in a project](#using-ui-core-in-a-project).

5. Add the following imports to your global styles SCSS:

```SCSS
// styles.scss
@import "~gentics-ui-core/styles/variables";
@import "~gentics-ui-core/styles/mixins";
@import "~gentics-ui-core/styles/core";

// ...
```

You can see the [_variables.scss](src/styles/_variables.scss) file for a list of variables, which you can override before importing the variables file.

## Documentation

Full documentation and examples are available at [https://gentics.github.io/gentics-ui-core/](https://gentics.github.io/gentics-ui-core/)

## Developer Guide

The following sections are intended for people, who want to contribute to Gentics UI Core.

The build system for the project is [angular-cli](https://cli.angular.io/) with a custom directory structure (to maintain the previous directory structure before the migration to angular-cli)
and a custom post-build gulp script. For full documentation on available commands, see [https://angular.io/cli](https://angular.io/cli).
Due to the post-build gulp script it is important to not use `ng build` directly, but always use `npm run build`.

The builder configured in [angular.json](./angular.json) is not the default one from angular-cli, but [ngx-build-plus](https://github.com/manfredsteyer/ngx-build-plus), 
because we need to be able to customize the webpack configuration.

### Git Branches

There are two important branches in this project: [master](https://github.com/gentics/gentics-ui-core) and [maintenance-v6.x](https://github.com/gentics/gentics-ui-core/tree/maintenance-v6.x).
From which one of these you need to create a new branch for development depends on what you want to work on:

* **New Feature** -> ```master``` branch
* **Bugfix**
  * If it is for a feature that existed already in version 6.x -> ```maintenance-v6.x``` branch
  * Otherwise -> ```master``` branch

**Important:** After merging a bugfix into the ```maintenance-v6.x``` branch:
1. Merge ```maintenance-v6.x``` into the ```master``` branch.
2. Run a test build on the ```master``` branch.
3. Run all unit tests on the ```master``` branch.
4. Test the bugfix manually in the docs app from the ```master``` branch.

### Running the units tests

To execute a single test run for the gentics-ui-core library and the docs app, execute:
```
npm test
```

To run tests in watch mode for the gentics-ui-core library, execute:
```
ng test gentics-ui-core
```

To run tests in watch mode for the docs app, execute:
```
ng test docs
```

### Building the docs app

Although the UI Core is intended to be consumed in a raw (uncompiled) state, there is a demo app
included under `src/demo` which will serve as a ["living style guide"](https://uxmag.com/articles/anchoring-your-design-language-in-a-live-style-guide)
as well as a way to manually test each of the core components.

1. `npm install`
2. `npm start`

This will rebuild the docs app on every change to the source files and serve the output on http://localhost:4200.

### Releasing

1. Bump the version in `projects/gentics-ui-core/package.json` to the desired value
2. `git commit -am 'vX.Y.Z'`
3. `git tag vX.Y.Z`
4. `git reset --hard HEAD^`
5. `git push origin vX.Y.Z master`

#### Publish to npm

1. `npm run build -- gentics-ui-core`
2. `npm publish ./dist/gentics-ui-core`

### Maintaining documentation on GitHub pages

Documentation is built as a static Angular app into "docs" and maintained on the branch "gh-pages".
The easiest way to manage the branch is to check it out in the "docs" subfolder:

```sh
# check out ui-core twice, master in ./ and gh-pages in ./docs
git clone -o github -b gh-pages git@github.com:gentics/gentics-ui-core ./docs
# build the docs (if you want to create separate version of the docs, you need to append --docsVersion=vX.x param)
npm run build -- docs --prod=true
# commit and push gh-pages
cd docs
git add .
git commit -m "Update latest docs to vX.Y.Z"
git push github
```
