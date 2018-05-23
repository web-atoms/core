

export type NameValuePairs = {
    [key:string]: any
};

export type NameValues = {
    [key:string]: (string|number|boolean)
};

export interface IDisposable {
    dispose():void ;
}



export class AtomDisposable implements IDisposable {

    private f:Function;

    /**
     *
     */
    constructor(f:Function) {
        this.f = f;
    }

    dispose(): void {
        this.f();
    }
}
