import * as A from "../App";
import { AtomBridge } from "../core/AtomBridge";
import { BusyIndicatorService } from "../services/BusyIndicatorService";
import { NavigationService } from "../services/NavigationService";
import { AtomXFControl } from "./controls/AtomXFControl";
import XFBusyIndicatorService from "./services/XFBusyIndicatorService";
import XFNavigationService from "./services/XFNavigationService";

declare var bridge: any;

export default class XFApp extends A.App {

    private mRoot: AtomXFControl;
    public get root(): AtomXFControl {
        return this.mRoot;
    }

    public set root(v: AtomXFControl) {
        this.mRoot = v;
        bridge.setRoot(v.element);
    }

    constructor() {
        super();
        AtomBridge.instance = bridge;
        this.put(NavigationService, this.resolve(XFNavigationService));
        this.put(BusyIndicatorService, this.resolve(XFBusyIndicatorService));
    }

}
