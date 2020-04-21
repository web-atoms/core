import * as A from "../App";
import { AtomBridge } from "../core/AtomBridge";
import { BusyIndicatorService } from "../services/BusyIndicatorService";
import { NavigationService } from "../services/NavigationService";
import { AtomStyleSheet } from "../web/styles/AtomStyleSheet";
import XFBusyIndicatorService from "./services/XFBusyIndicatorService";
import XFNavigationService from "./services/XFNavigationService";

declare var bridge: any;

export default class XFApp extends A.App {

    private mLastStyle: string = null;

    private mRoot: any;
    public get root(): any {
        return this.mRoot;
    }

    public set root(v: any) {
        this.mRoot = v;
        bridge.setRoot(v.element);
    }

    constructor() {
        super();
        AtomBridge.instance = bridge;
        this.put(NavigationService, this.resolve(XFNavigationService));
        this.put(BusyIndicatorService, this.resolve(XFBusyIndicatorService));
        this.put(AtomStyleSheet, this.resolve(AtomStyleSheet, true));

        const s = bridge.subscribe((channel, data) => {
            this.broadcast(channel, data);
        });

        // register for messaging...
        const oldDispose = this.dispose;
        this.dispose = () => {
            s.dispose();
            oldDispose.call(this);
        };
    }

    public updateDefaultStyle(textContent: string) {
        if (this.mLastStyle === textContent) {
            return;
        }
        this.mLastStyle = textContent;
        bridge.updateDefaultStyle(textContent);
        // if (this.styleElement) {
        //     if (this.styleElement.textContent === textContent) {
        //         return;
        //     }
        // }
        // const ss = document.createElement("style");

        // ss.textContent = textContent;
        // if (this.styleElement) {
        //     this.styleElement.remove();
        // }
        // document.head.appendChild(ss);
        // this.styleElement = ss;
    }

    public broadcast(channel: string, data: any) {
        super.broadcast(channel, data);
        bridge.broadcast(channel, data);
    }

}
