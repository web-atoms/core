// tslint:disable-next-line:no-empty-interface
export interface INativeComponent {

<<<<<<< HEAD
}

export declare class AtomElementExtensions {
    public static addEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
    public static removeEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
}

export type IAtomElement = HTMLElement | INativeComponent;

export interface NameValuePairs {
=======
export interface INameValuePairs {
>>>>>>> cb8a44c2dd6d8dbeaeb052fff2b7a61b07ee83cb
    [key: string]: any;
}

export interface INameValues {
    [key: string]: (string|number|boolean);
}

export interface IDisposable {
    dispose(): void ;
}

export class AtomDisposable implements IDisposable {

    // tslint:disable-next-line:ban-types
    private f: Function;

    /**
     *
     */
    // tslint:disable-next-line:ban-types
     constructor(f: Function) {
        this.f = f;
    }

    public dispose(): void {
        this.f();
    }
}
