// tslint:disable-next-line:no-empty-interface
export interface INativeComponent {

}

export type IAtomElement = HTMLElement | INativeComponent;

export declare class AtomElementExtensions {
    public static addEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
    public static removeEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
}

export interface INameValuePairs {
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
