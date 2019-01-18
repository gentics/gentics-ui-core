# Gentics UI Core

This is the common core framework for the Gentics CMS and Mesh UI, and other Angular applications.

## Using ui-core in a project

1. Install via npm:
```
npm install gentics-ui-core --save
```

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

## View Encapsulation

Do not use any ViewEncapsulation other than `ViewEncapsulation.None` (which is the default), because some UI Core components use the CSS `/deep/` selector.

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

1. Create a new app using angular-cli (this guide assumes angular-cli version 7.x). The following command will create a new app with the name `my-example` in the folder `./my-example`, use `me` as the prefix for components, set up a routing module, and use SCSS for defining styles. Please note that while a custom prefix and the routing module are optional, SCSS must be used for the styles in order to be compatible with Gentics UI Core.

```
ng new my-example --prefix=me --routing=true --style=scss
```

2. Uncomment (and if necessary, install) the polyfills required for your target browsers in `polyfills.ts` and add the following assignment in that file:

```TypeScript
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
// This is necessary, because GUIC uses the Intl library, which requires a global object (like in Node.js).
(window as any).global = window;
```

3. Follow the steps from [Using ui-core in a project](#using-ui-core-in-a-project).

4. Add the following imports to your global styles SCSS:

```SCSS
// styles/main.scss
$icons-font-path: '~gentics-ui-core/dist/fonts/';
$roboto-font-path: '~gentics-ui-core/dist/fonts/';

@import "~gentics-ui-core/dist/styles/variables";
@import "~gentics-ui-core/dist/styles/mixins";
@import "~gentics-ui-core/dist/styles/core";

// ...
```

You can see the [_variables.scss](src/styles/_variables.scss) file for a list of variables, which you can override before importing the variables file.

## Documentation

Full documentation and examples are available at [https://gentics.github.io/gentics-ui-core/](https://gentics.github.io/gentics-ui-core/)

The build system for the project is [angular-cli](https://cli.angular.io/) with a custom directory structure (to maintain the previous directory structure before the migration to angular-cli)
and a custom post-build gulp script. For full documentation on available commands, see [https://angular.io/cli](https://angular.io/cli).

## Building the docs app

Although the UI Core is intended to be consumed in a raw (uncompiled) state, there is a demo app
included under `src/demo` which will serve as a ["living style guide"](https://uxmag.com/articles/anchoring-your-design-language-in-a-live-style-guide)
as well as a way to manually test each of the core components.

1. `npm install`
2. `npm start`

This will rebuild the docs app on every change to the source files and serve the output on http://localhost:4200.

## Releasing

1. Bump the version in `projects/gentics-ui-core/package.json` to the desired value
2. `git commit -am 'vX.Y.Z'`
3. `git tag vX.Y.Z`
4. `git reset --hard HEAD^`
5. `git push origin vX.Y.Z master`

### Publish to npm

1. `npm run build gentics-ui-core --prod=true`
2. `npm publish ./dist/gentics-ui-core`

## Maintaining documentation on GitHub pages

Documentation is built as a static Angular app into "docs" and maintained on the branch "gh-pages".
The easiest way to manage the branch is to check it out in the "docs" subfolder:

```sh
# check out ui-core twice, master in ./ and gh-pages in ./docs
git clone -o github -b gh-pages git@github.com:gentics/gentics-ui-core ./docs
# build the docs
npm run build docs --prod=true --aot=true
# copy the output files to the docs folder
rm -r ./docs/*
cp -r ./dist/docs/* ./docs
# commit and push gh-pages
cd docs
git add .
git commit -m "Update docs to vX.Y.Z"
git push github
```
