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
2. Register unit test class as `instance.discover(unitTestModule)`
3. Run `node index.js`

