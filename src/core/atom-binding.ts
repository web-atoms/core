import { NameValues, NameValuePairs } from "./types";
import { AtomControl } from "../controls/atom-control";
import { AtomBinder } from "./atom-binder";

export class AtomBinding {
    twoWays: NameValues;
    isUpdating: boolean;
    pathList: Array<{path:string,value:any}>[];
    events: string;
    key: string;
    vf: Function;
    control: AtomControl;
    element: HTMLElement;
    jq: Boolean;
    path: Array<{path:string,value:any}>;

    /**
     *
     */
    // tslint:disable-next-line:max-line-length
    constructor(control:AtomControl, element: HTMLElement, key: string, path: string, twoWays:NameValues, jq: boolean, vf:Function, events: string) {
        this.element = element;
        this.control = control;
        this.vf = vf;
        this.key = key;
        this.events = events;

        if (Array.isArray(path)) {
            this.pathList = [];
            this.path = [];
            for(const a of path) {
                var item: string = a;
                if(!Array.isArray(item)) {
                    this.path.push({ path: item, value: null });
                    continue;
                }
                for(const b of item) {
                    var p:Array<{path:string,value:any}> =[];
                    b.push({ path: p, value: null });
                }
                this.pathList.push(p);
            }
            if (this.path.length) {
                this.pathList = null;
            } else {
                this.path = null;
            }

        } else {
            var ae:string[] = path.split(".");
            this.path = [];
            for(const c of ae) {
                this.path.push({ path: c, value: null });
            }
        }
        this.twoWays = twoWays;
        this.jq = jq;
        this.isUpdating = false;
    }

    onPropChanged(sender: NameValues, key:string): NameValues {
        // update target....
        // most like end of path...
        if (this.path == null || this.path.length === 0) {
            return;
        }
        var obj: AtomControl = this.control;
        var objKey: {path:string,value:any} = null;
        for(const t of this.path) {
            objKey = t;
            objKey.value = obj;
            if (!obj) {
                return;
            }
            if (this.path.lastIndexOf(t) !== this.path.length) {
                obj = AtomBinder.getValue(obj, objKey.path);
            }
        }
        var value:boolean = null;

        // doubt

        // if (this.jq) {
        //     switch (this.key) {
        //         case "valueAsDate":
        //             value = this.element.valueAsDate;
        //             break;
        //         case "checked":
        //             value = this.element.checked ? true : false;
        //             break;
        //         default:
        //             value = $(this.element).val();
        //     }
        // } else {
        //     value = AtomBinder.getValue(this.control, this.key);
        // }
        AtomBinder.setValue(obj, objKey.path, value);
    }

    onDataChanged(sender: NameValues, key:string): NameValues {
        if (this.isUpdating) {
            return;
        }
        // called by jquery while posting an ajax request...
        if (arguments === undefined || arguments.length === 0) {
            return;
        }
        var target: AtomControl = this.control;
        if (this.pathList) {
            var newTarget:Array<{path:string,value:any}> = [];
            for(const ae of this.pathList) {
                newTarget.push(this.evaluate(target, ae));
            }
            for(const n of newTarget) {
                if (n === undefined) {
                    return;
                }
            }
            this.setValue(newTarget);
        } else {
            var path: Array<{path:string,value:any}> = this.path;
            var nTarget: {path:string,value:any} = this.evaluate(target, path);
            if (nTarget !== undefined) {
                this.setValue(newTarget);
            }
        }
    }
    evaluate(target: AtomControl, path: Array<{path:string,value:any}>): {path:string,value:any} {
        var newTarget: {path:string,value:any} = null;
        var property: {path:string,value:any} = null;
        for(const v of path) {
           // first remove old handlers...
            var remove: boolean = false;
            while(target) {
                property = v ;
                newTarget = AtomBinder.getValue(target, property.path);
                if (!(/scope|appScope|atomParent|templateParent|localScope/gi.test(property.path))) {

                    // doubt
                    // var _this = this;
                    if (!property.value) {
                    this.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
                    } else if (property.value !== target) {
                        this.unbindEvent(property.value, "WatchHandler", null, property.path);
                        this.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
                    }
                }
                property.value = target;
                target = newTarget;
            }

            // doubt
            // if (newTarget === undefined && AtomConfig.debug) {
            //     log("Undefined:" + this.control._element.id + " -> " + ($.map(path, function (a) { return a.path; })).join("."));
            // }
            return newTarget;
        }
    }

    static onValChanged(): any {
        // doubt
        // var self= this;
        // webAtoms.dispatcher.callLater(function () { self.onPropChanged(null, null); });
    }

    unbindEvent(arg0: any, arg1: any, arg2: any, arg3: any): any {
        throw new Error("Method not implemented.");
    }
    bindEvent(arg0: any, arg1: any, arg2: any, arg3: any): any {
        throw new Error("Method not implemented.");
    }
    setValue(arg0: any): any {
        throw new Error("Method not implemented.");
    }
}