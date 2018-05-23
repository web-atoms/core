# Web-Atoms Core
Web Atoms Core is a UI abstraction framework along with powerful MVVM pattern to design modern web and mobile applications.

## Features
1. Abstract Atom Component
2. Abstract Device API (Browser Service, Message Broadcast)
3. Recreated in TypeScript
4. `AMD` Module support

## Development guidelines
1. Use TypeScript `module` pattern
2. Do not use `namespace`
3. Organize single module in single TypeScript file
4. Import only required module and retain naming convention
5. Do not define any default export


### List of controls Planned

#### Phase 1
1. AtomControl
2. AtomItemsControl
...

#### Phase 2
...

#### Phase 3 
...


## How to run unit tests?

1. Import test class `src\test.ts`
2. Run `node .\bin\test.js`

## How to get code coverage?

1. Install istanbul, `npm install istanbul --save-dev`
2. Install remap-istanbul, `npm install remap-istanbul`
3. Cover Run, `.\node_modules\.bin\istanbul.cmd cover .\bin\test.js`
4. Report Run, `.\node_modules\.bin\remap-istanbul -i .\coverage\coverage.json -t html -o html-report`
5. Open generated html-report on browser
