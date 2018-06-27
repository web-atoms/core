import * as A from "../App";
import { AtomPage } from "./controls/AtomPage";

declare var App: any;

export class XFApp extends A.App {

    private mPage: AtomPage;
    public get page(): AtomPage {
        return this.mPage;
    }

    public set page(v: AtomPage) {
        this.mPage = v;
        App.CurrentPage = v.element;
    }

    protected onReady(f: () => void): void {
        f();
    }
}
