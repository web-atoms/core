[![Action Status](https://github.com/web-atoms/core/workflows/Build/badge.svg)](https://github.com/web-atoms/core/actions) [![npm version](https://badge.fury.io/js/%40web-atoms%2Fcore.svg)](https://badge.fury.io/js/%40web-atoms%2Fcore) [![codecov](https://codecov.io/gh/web-atoms/core/branch/master/graph/badge.svg)](https://codecov.io/gh/web-atoms/core)

# Web-Atoms Core
Lightweight JavaScript framework with MVU Pattern with Data Binding in JSX.

> Note, MVVM is now deprecated, we have realized that MVVM often adds more code then the benefits. Since JavaScript allows mixin, its easy to incorporate
> reusable logic with mixin rather than MVVM. MVU pattern is better suitable for faster development.

## Web Features
1. Data Binding, simple arrow functions to bind the UI elements
2. Styled Support
3. AtomRepeater - Lightweight List Control to manage list of items
4. Chips control
5. Dual View support (Mobile and Desktop)
6. Smallest syntax
7. Faster rendering
8. Simple Data Validations
9. RetroFit inspired REST API Support
10. No additional build configurations
11. Event re routing, it helps in reducing number of event listeners on page.
12. UMD and SystemJS Module Loader
13. Packer, to pack all JavaScript in single module along with dynamic module loader support
14. FetchBuilder, fetch builder allows you to build REST request in fluent way and execute them with single `await`.

## Web Controls
1. ComboBox (wrapper for SELECT element)
2. AtomControl (base class for all other controls)
3. AtomRepeater
4. PopupWindow, PopupWindowPage

## Services
1. WindowService - to host AtomWindow and retrieve result
2. RestService - RetroFit kind of service for simple ajax
3. BrowserService - An abstract navigation service for Web and Xamarin

## Development guidelines
1. Use TypeScript `module` pattern
2. Do not use `namespace`
3. Organize single module in single TypeScript file
4. Import only required module and retain naming convention
5. Use default export for UI component
6. No `Atom.get` and `Atom.set`
7. Do not use underscore `_` anywhere, not in field name not in get/set
8. Do not use `set_name` method name, instead use `get name()` and `set name(v: T)` syntax for properties.


## How to run unit tests?

1. Import test class `src\test.ts`
2. Run `node .\dist\test.js`

## How to get code coverage?

1. Install istanbul, `npm install istanbul --save-dev`
2. Install remap-istanbul, `npm install remap-istanbul`
3. Cover Run, `.\node_modules\.bin\istanbul.cmd cover .\dist\test.js`
4. Report Run, `.\node_modules\.bin\remap-istanbul -i .\coverage\coverage.json -t html -o html-report`
5. Open generated html-report on browser
