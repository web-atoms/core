# Web-Atoms Core
Web Atoms Core is a UI abstraction framework along with powerful MVVM pattern to design modern web and mobile applications.

## Features
1. Abstract Atom Component
2. Abstract Device API (Browser Service, Message Broadcast)
3. Theme and styles support without CSS
4. One time, One way and Two way binding support
5. Simple dependency Injection
6. In built simple unit testing framework
7. CommonJS module support
8. Full featured MVVM Framework with powerful validation
9. Single code base for Business Logic (View Model + Services) for Web as well as Mobile (through Xamarin.Forms)

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
|  +--tasks
|     +--TaskListView.html
|     +--TaskEditorView.html
|
+--xf
   +--tasks
      +--TaskListView.xaml
      +--TaskEditorView.xaml 
```

### Example View Model

```typescript

export class UserListViewModel extends AtomViewModel {

    /// @bindableProperty will create accessor and mutator
    /// for the given field name and it will automatically
    /// refresh bindings
    @bindableProperty
    public user: any;

    /// @validate decorator will process this accessor
    /// in a way that it will always return null till
    /// you call this.isValid. After this.isValid is 
    /// called, it will display an error if data is invalid
    @validate
    public get errorName(): string {
        return this.user.name ? "" : "Name cannot be empty";
    }

    /// You can bind UI element to this field, @watch decorator
    /// will process this accessor in a way that UI element bound
    /// to this field will automatically update whenver any of
    /// fields referenced in this method is updated anywhere else
    @watch
    public get name(): string {
        return `${this.user.firstName} ${this.user.lastName}`;
    }

    public async addNew(): Promise<any> {
        // this will validate all accessors
        // marked with @validate
        if (!this.isValid) {
            await this.windowService.alert("Please complete all required fields");
        }
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
1. WindowService - to host AtomWindow and retrive result
2. RestService - RetroFit kind of service for simple ajax
3. BrowserService - An abstract navigation service for Web and Xamarin

## Development guidelines
1. Use TypeScript `module` pattern
2. Do not use `namespace`
3. Organize single module in single TypeScript file
4. Import only required module and retain naming convention
5. Do not define any default export


## How to run unit tests?

1. Import test class `src\test.ts`
2. Run `node .\bin\test.js`

## How to get code coverage?

1. Install istanbul, `npm install istanbul --save-dev`
2. Install remap-istanbul, `npm install remap-istanbul`
3. Cover Run, `.\node_modules\.bin\istanbul.cmd cover .\bin\test.js`
4. Report Run, `.\node_modules\.bin\remap-istanbul -i .\coverage\coverage.json -t html -o html-report`
5. Open generated html-report on browser
