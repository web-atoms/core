import { NameValues } from "./types";
import { AtomControl } from "../controls/atom-control";
export declare class AtomBinding {
    twoWays: NameValues;
    isUpdating: boolean;
    pathList: Array<{
        path: string;
        value: any;
    }>[];
    events: string;
    key: string;
    vf: Function;
    control: AtomControl;
    element: HTMLElement;
    jq: Boolean;
    path: Array<{
        path: string;
        value: any;
    }>;
    /**
     *
     */
    constructor(control: AtomControl, element: HTMLElement, key: string, path: string, twoWays: NameValues, jq: boolean, vf: Function, events: string);
    onPropChanged(sender: NameValues, key: string): NameValues;
    onDataChanged(sender: NameValues, key: string): NameValues;
    evaluate(target: AtomControl, path: Array<{
        path: string;
        value: any;
    }>): {
        path: string;
        value: any;
    };
    static onValChanged(): any;
    unbindEvent(arg0: any, arg1: any, arg2: any, arg3: any): any;
    bindEvent(arg0: any, arg1: any, arg2: any, arg3: any): any;
    setValue(arg0: any): any;
}
