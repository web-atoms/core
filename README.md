[![Action Status](https://github.com/web-atoms/core/workflows/Build/badge.svg)](https://github.com/web-atoms/core/actions) [![npm version](https://badge.fury.io/js/%40web-atoms%2Fcore.svg)](https://badge.fury.io/js/%40web-atoms%2Fcore) [![codecov](https://codecov.io/gh/web-atoms/core/branch/master/graph/badge.svg)](https://codecov.io/gh/web-atoms/core)

# Web-Atoms Core
Web Atoms Core is a UI abstraction framework along with powerful MVVM pattern to design modern Web Applications.

> Note, Xamarin Forms support is now deprecated, as we are migrating to new mobile framework.

## Web Features
1. Functional Components
2. Abstract Atom Component
3. Abstract Device API (Browser Service, Message Broadcast)
4. Theme and styles support without CSS
5. One time, One way and Two way binding support
6. Simple dependency Injection
7. In built simple unit testing framework
8. UMD module support
9. Full featured MVVM Framework with powerful validation

## Folder structure
1. All views for web must be placed under "web" folder inside "src" folder.
2. All views for Xamarin Forms must be placed under "xf" folder inside "src" folder.

### Example folder structure
```
src
+--images
|  +--AddButton.svg
|
+--view-Models
|  +--TaskListViewModel.ts
|  +--TaskEditorViewModel.ts
|
+--web
   +--tasks
      +--TaskListView.tsx
      +--TaskEditorView.tsx
```

### Example View Model

```typescript

export class UserListViewModel extends AtomViewModel {

    public user: any;

    public list: IUser[];

    public search: string = null;

    /// Dependency Injection
    @Inject
    private listService: ListService;

    /// @validate decorator will process this accessor
    /// in a way that it will always return null till
    /// you call this.isValid. After this.isValid is 
    /// called, it will display an error if data is invalid
    @Validate
    public get errorName(): string {
        return this.user.name ? "" : "Name cannot be empty";
    }

    /// You can bind UI element to this field, @watch decorator
    /// will process this accessor in a way that UI element bound
    /// to this field will automatically update whenever any of
    /// fields referenced in this method is updated anywhere else
    @Watch
    public get name(): string {
        return `${this.user.firstName} ${this.user.lastName}`;
    }

    /// this will be called immediately after the view model 
    /// has been initialized
    /// this will refresh automatically when `this.search` is updated
    /// refresh will work for all (this.*.*.*) properties at any level
    @Load({ init: true, watch: true })
    public async loadItems(ct: CancelToken): Promise<void> {
        this.list = await this.listService.loadItems(this.search, ct);
    }

    /// this will validate all accessors before executing the action
    /// and display success message if action was successful
    @Action({ validate: true, success: "Added successfully" })
    public async addNew(): Promise<any> {
        ... 
    }

}

```

## Web Controls
1. AtomComboBox (wrapper for SELECT element)
2. AtomControl (base class for all other controls)
3. AtomItemsControl
4. AtomListBox
5. AtomPageView (control browser that hosts other control referenced by url)
6. AtomWindow

## Services
1. WindowService - to host AtomWindow and retrieve result
2. RestService - RetroFit kind of service for simple ajax
3. BrowserService - An abstract navigation service for Web and Xamarin

## Development guidelines
1. Use TypeScript `module` pattern
2. Do not use `namespace`
3. Organize single module in single TypeScript file
4. Import only required module and retain naming convention
5. Do not define any default export
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
