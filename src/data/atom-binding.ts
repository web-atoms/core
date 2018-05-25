import { AtomControl } from "../controls/atom-control";
import { Atom } from "../core/atom";
import { AtomBinder } from "../core/atom-binder";
import { AtomComponent } from "../core/atom-component";
import { AtomDispatcher } from "../core/atom-dispatcher";
import { AtomUI } from "../core/atom-ui";
import { NameValuePairs, NameValues } from "../core/types";
import { AtomPromise } from "../data/atom-promise";

export class AtomBinding {
    public lastValue: any;
    public twoWays: NameValues;
    public isUpdating: boolean;
    public events: string;
    public key: string;
    public vf: (() => any);
    public control: AtomControl;
    public element: HTMLElement;
    public jq: boolean;
    // public AtomConfig = {
    //     debug: false,
    //     baseUrl: "",
    //     log: "",
    //     ajax: {
    //         versionUrl: true,
    //         versionKey: "__wav",
    //         version: ((new Date()).toDateString()),
    //         headers: {
    //         }
    //     }
    // };
    public com: AtomComponent = new AtomComponent();
    public disp: AtomDispatcher = new AtomDispatcher();
    public path: Array<{path: string, value: any}>;
    public pathList: Array<{path: string, value: any}>[];

    /**
     *
     */
    // tslint:disable-next-line:max-line-length
    constructor(control: AtomControl, element: HTMLElement, key: string, path: string, twoWays: NameValues, jq: boolean, vf: (() => any), events: string) {
        this.element = element;
        this.control = control;
        this.vf = vf;
        this.key = key;
        this.events = events;

        if (Array.isArray(path)) {
            this.pathList = [];
            this.path = [];
            for (const a of path) {
                const item: string = a;
                if (!Array.isArray(item)) {
                    this.path.push({ path: item, value: null });
                    continue;
                }
                const p: Array<{path: string, value: any}> = [];
                for (const b of item) {
                    p.push({ path: b, value: null });
                }
                this.pathList.push(p);
            }
            if (this.path.length) {
                this.pathList = null;
            } else {
                this.path = null;
            }

        } else {
            const ae: string[] = path.split(".");
            this.path = [];
            for (const c of ae) {
                this.path.push({ path: c, value: null });
            }
        }
        this.twoWays = twoWays;
        this.jq = jq;
        this.isUpdating = false;
    }

    public onPropChanged(sender: NameValues, key: string): NameValues {
        // update target....
        // most like end of path...
        if (this.path == null || this.path.length === 0) {
            return;
        }
        let obj: AtomControl = this.control;
        let objKey: {path: string, value: any} = null;
        for (const t of this.path) {
            objKey = t;
            objKey.value = obj;
            if (!obj) {
                return;
            }
            if (this.path.lastIndexOf(t) !== this.path.length) {
                obj = AtomBinder.getValue(obj, objKey.path);
            }
        }
        let value: any = null;

        if (this.jq) {
            switch (this.key) {
                case "valueAsDate":
                    value = (this.element as HTMLInputElement).valueAsDate;
                    break;
                case "checked":
                    value = (this.element as HTMLInputElement).checked ? true : false;
                    break;
                default:
                // doubt
                    // value = $(this.element).val();
            }
        } else {
            value = AtomBinder.getValue(this.control, this.key);
        }
        AtomBinder.setValue(obj, objKey.path, value);
    }

    public onDataChanged(sender: any, key: string): NameValues {
        if (this.isUpdating) {
            return;
        }
        // called by jquery while posting an ajax request...
        if (arguments === undefined || arguments.length === 0) {
            return;
        }
        const target: any = this.control;
        if (this.pathList) {
            const newTarget: Array<{path: string, value: any}> = [];
            for (const ae of this.pathList) {
                newTarget.push(this.evaluate(target, ae));
            }
            for (const n of newTarget) {
                if (n === undefined) {
                    return;
                }
            }
            this.setValue(newTarget);
        } else {
            const path: Array<{path: string, value: any}> = this.path;
            const nTarget: any = this.evaluate(target, path);
            if (nTarget !== undefined) {
                this.setValue(nTarget);
            }
        }
    }
    public evaluate(target: any, path: Array<{path: string, value: any}>): any {
        let newTarget: any = null;
        let property: {path: string, value: any} = null;
        for (const v of path) {
           // first remove old handlers...
            const remove: boolean = false;
            while (target) {
                property = v ;
                newTarget = AtomBinder.getValue(target, property.path);
                if (!(/scope|appScope|atomParent|templateParent|localScope/gi.test(property.path))) {
                    if (!property.value) {
                    this.com.bindEventbindEvent(target, "WatchHandler", "onDataChanged", property.path);
                    } else if (property.value !== target) {
                        this.com.unbindEvent(property.value, "WatchHandler", null, property.path);
                        this.com.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
                    }
                }
                property.value = target;
                target = newTarget;
            }

            // doubt
            // if (newTarget === undefined && AtomConfig.debug) {
            // tslint:disable-next-line:max-line-length
            //     log("Undefined:" + this.control._element.id + " -> " + ($.map(path, function (a) { return a.path; })).join("."));
            // }
            return newTarget;
        }
    }

    public onValChanged(): any {
        const self: any = this;
        this.disp.callLater(self.onPropChanged(null, null));
    }

    public setup(): void {
        if (this.twoWays) {
            if (this.jq) {
                this.com.bindEvent(this.element, "change", "onValChanged", null);
                this.com.bindEvent(this.element, "blur", "onValChanged", null);
                if (this.events) {
                    for (const a of this.events.split(",")) {
                        this.com.bindEvent(this.element, a, "onValChanged", null);
                    }
                }
            } else {
                this.com.bindEvent(this.control, "WatchHandler", "onPropChanged", this.key);
            }
        }
        this.onDataChanged(this, null);
    }

    public setValue(value: any): any {
        if (!this.pathList && this.vf) {
            value = [value];
        }

        if (this.vf) {
            value.push(Atom);
            value.push(AtomPromise);
            // doubt
           // value.push($x);
            value = this.vf.apply(this, value);
        }

        if (value instanceof AtomPromise) {
            value.persist = true;
        }

        this.lastValue = value;
        this.isUpdating = true;
        this.control.setLocalValue(this.key, value, this.element, true);
        this.isUpdating = false;
    }
}
