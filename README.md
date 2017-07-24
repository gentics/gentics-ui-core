# Gentics UI Core

This is the common core framework for the Gentics CMS and Mesh UI apps.

## Using ui-core in a project

1. Install via npm:
```
npm install gentics-ui-core
```
2. Import the module and add it to your apps root module:
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

## Documentation

Full documentation and examples are available at [https://dev.gentics.com/gentics-ui-core/](https://dev.gentics.com/gentics-ui-core/)

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
4. `git reset --hard HEAD^`
5. `git push origin vX.Y.Z master`

### Publish to npm

1. `gulp dist:build`
2. `npm publish`
