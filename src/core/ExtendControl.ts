type IAtomControl = new (... args: any[]) => {};

export default function ExtendControl<T extends IAtomControl>(ctrl:T) {

    abstract class ExtendedControl extends ctrl {
        constructor(... args: any[]) {
            super(... args);
            (this as any).runAfterInit(() => (this as any).app.runAsync(() => this.init()));
        }

        abstract init(): Promise<any>;
    }
    return ExtendedControl;
}
