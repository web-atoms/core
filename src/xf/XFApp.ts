import * as A from "../App";
import { AtomXFControl } from "./controls/AtomXFControl";

declare var App: any;

export default class XFApp extends A.App {

    private mRoot: AtomXFControl;
    public get root(): AtomXFControl {
        return this.mRoot;
    }

    public set root(v: AtomXFControl) {
        this.mRoot = v;
        App.CurrentPage = v.element;
    }

    protected onReady(f: () => void): void {
        f();
    }
}
