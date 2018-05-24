

export interface NameValuePairs {
    [key: string]: any;
};

export interface NameValues {
    [key: string]: (string|number|boolean);
};

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
