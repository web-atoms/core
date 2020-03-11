import * as A from "../App";
import { AtomBridge } from "../core/AtomBridge";
import { BusyIndicatorService } from "../services/BusyIndicatorService";
import { NavigationService } from "../services/NavigationService";
import XFBusyIndicatorService from "./services/XFBusyIndicatorService";
import XFNavigationService from "./services/XFNavigationService";

declare var bridge: any;

export default class XFApp extends A.App {

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

    public broadcast(channel: string, data: any) {
        super.broadcast(channel, data);
        bridge.broadcast(channel, data);
    }

}
