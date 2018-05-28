// Atom Binding is no longer needed - Akash Kava

// import { NameValues, NameValuePairs } from "../core/types";
// import { AtomControl } from "../controls/atom-control";
// import { AtomComponent } from "../core/atom-component";
// import { AtomDispatcher } from "../core/atom-dispatcher";
// import { AtomBinder } from "../core/atom-binder";
// import { Atom } from "../core/atom";
// import { AtomPromise } from "../data/atom-promise";

// export class AtomBinding {
//     lastValue: any;
//     twoWays: NameValues;
//     isUpdating: boolean;
//     pathList: Array<{path:string,value:any}>[];
//     events: string;
//     key: string;
//     vf: Function;
//     control: AtomControl;
//     element: HTMLElement;
//     jq: Boolean;
//     path: Array<{path:string,value:any}>;

//     /**
//      *
//      */
//     // tslint:disable-next-line:max-line-length
//     constructor(control:AtomControl, element: HTMLElement, key: string, path: string,
// twoWays:NameValues, jq: boolean, vf:Function, events: string) {
//         this.element = element;
//         this.control = control;
//         this.vf = vf;
//         this.key = key;
//         this.events = events;

//         if (Array.isArray(path)) {
//             this.pathList = [];
//             this.path = [];
//             for(const a of path) {
//                 var item: string = a;
//                 if(!Array.isArray(item)) {
//                     this.path.push({ path: item, value: null });
//                     continue;
//                 }
//                 for(const b of item) {
//                     var p:Array<{path:string,value:any}> =[];
//                     b.push({ path: p, value: null });
//                 }
//                 this.pathList.push(p);
//             }
//             if (this.path.length) {
//                 this.pathList = null;
//             } else {
//                 this.path = null;
//             }

//         } else {
//             var ae:string[] = path.split(".");
//             this.path = [];
//             for(const c of ae) {
//                 this.path.push({ path: c, value: null });
//             }
//         }
//         this.twoWays = twoWays;
//         this.jq = jq;
//         this.isUpdating = false;
//     }

//     onPropChanged(sender: NameValues, key:string): NameValues {
//         // update target....
//         // most like end of path...
//         if (this.path == null || this.path.length === 0) {
//             return;
//         }
//         var obj: AtomControl = this.control;
//         var objKey: {path:string,value:any} = null;
//         for(const t of this.path) {
//             objKey = t;
//             objKey.value = obj;
//             if (!obj) {
//                 return;
//             }
//             if (this.path.lastIndexOf(t) !== this.path.length) {
//                 obj = obj[objKey.path];
//             }
//         }
//         var value: any = null;

//         // doubt
//         if (this.jq) {
//             switch (this.key) {
//                 case "valueAsDate":
//                     value = (this.element as HTMLInputElement).valueAsDate;
//                     break;
//                 case "checked":
//                     value = (this.element as HTMLInputElement).checked ? true : false;
//                     break;
//                 default:
//                 // doubt
//                     // value = $(this.element).val();
//             }
//         } else {
//             value = this.control[this.key];
//         }
//         obj[objKey.path] = value;
//     }

//     onDataChanged(sender: NameValues, key:string): NameValues {
//         if (this.isUpdating) {
//             return;
//         }
//         // called by jquery while posting an ajax request...
//         if (arguments === undefined || arguments.length === 0) {
//             return;
//         }
//         var target: AtomControl = this.control;
//         if (this.pathList) {
//             var newTarget:Array<{path:string,value:any}> = [];
//             for(const ae of this.pathList) {
//                 newTarget.push(this.evaluate(target, ae));
//             }
//             for(const n of newTarget) {
//                 if (n === undefined) {
//                     return;
//                 }
//             }
//             this.setValue(newTarget);
//         } else {
//             var path: Array<{path:string,value:any}> = this.path;
//             var nTarget: {path:string,value:any} = this.evaluate(target, path);
//             if (nTarget !== undefined) {
//                 this.setValue(nTarget);
//             }
//         }
//     }
//     evaluate(target: AtomControl, path: Array<{path:string,value:any}>): {path: string,value:any} {
//         var newTarget: {path: string,value: any} = null;
//         var property: {path: string,value: any} = null;
//         for(const v of path) {
//            // first remove old handlers...
//             var remove: boolean = false;
//             while(target) {
//                 property = v ;
//                 newTarget = target[property.path];
//                 if (!(/scope|appScope|atomParent|templateParent|localScope/gi.test(property.path))) {
//                     if (!property.value) {
//                     AtomComponent.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
//                     } else if (property.value !== target) {
//                         AtomComponent.unbindEvent(property.value, "WatchHandler", null, property.path);
//                         AtomComponent.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
//                     }
//                 }
//                 property.value = target;
//                 // doubt
//                // target = newTarget;
//             }

//             // doubt
//             // if (newTarget === undefined && AtomConfig.debug) {
//             //     log("Undefined:" + this.control._element.id + " -> " +
// ($.map(path, function (a) { return a.path; })).join("."));
//             // }
//             return newTarget;
//         }
//     }

//     public static onValChanged(): any {
//         // doubt
//         // var self= this;
//         // tslint:disable-next-line:comment-format
//         // AtomDispatcher.callLater(self.onPropChanged(null, null));
//     }

//     public setup(): any {
//         if (this.twoWays) {
//             if (this.jq) {
//                 AtomComponent.bindEvent(this.element, "change", "onValChanged", null);
//                 AtomComponent.bindEvent(this.element, "blur", "onValChanged", null);
//                 if (this.events) {
//                     for (const a of this.events.split(",")) {
//                         AtomComponent.bindEvent(this.element, a, "onValChanged", null);
//                     }
//                 }
//             } else {
//                 AtomComponent.bindEvent(this.control, "WatchHandler", "onPropChanged", this.key);
//             }
//         }
//         // doubt
//         // this.onDataChanged(this, null);
//     }
//     public setValue(value: any): any {
//         if (!this.pathList && this.vf) {
//             value = [value];
//         }

//         if (this.vf) {
//             value.push(Atom);
//             value.push(AtomPromise);
//             // doubt
//             // value.push($x);
//             value = this.vf.apply(this, value);
//         }

//         if (value instanceof AtomPromise) {
//             value.persist = true;
//         }

//         this.lastValue = value;
//         this.isUpdating = true;
//         this.control.setLocalValue(this.key, value, this.element, true);
//         this.isUpdating = false;
//     }
// }
