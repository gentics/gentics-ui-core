# Gentics UI Core

This is the common core framework for the Gentics CMS and Mesh UI apps.

## Using ui-core in a project

1. Add ui-core to the projects package.json:
```
"gentics-ui-core": "git+ssh://git@git.gentics.com:psc/gentics-ui-core-npm-package.git#v5.0.0"
```
2. Install it using npm:
```
npm install
```
3. Import the module and add it to your apps root module:
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

## Building the docs app

Although the UI Core is intended to be consumed in a raw (uncompiled) state, there is a demo app
included under `src/demo` which will serve as a ["living style guide"](https://uxmag.com/articles/anchoring-your-design-language-in-a-live-style-guide)
as well as a way to manually test each of the core components.

1. `npm install`
2. `gulp docs:build`
3. Serve the contents of the `docs/` folder

A fairly recent version of the docs app is also [availiable on dev.gentics.com](https://dev.gentics.com/gentics-ui-core/).

## Releasing

1. `npm shrinkwrap`
2. `git commit -am 'vX.Y.Z'`
3. `git tag vX.Y.Z`
4. `git checkout HEAD^`
5. `git push origin vX.Y.Z master`
