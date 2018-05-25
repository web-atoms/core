import { AtomControl } from "../controls/atom-control";
import { AtomComponent } from "../core/atom-component";
import { AtomDispatcher } from "../core/atom-dispatcher";
import { NameValues } from "../core/types";
export declare class AtomBinding {
    lastValue: any;
    twoWays: NameValues;
    isUpdating: boolean;
    events: string;
    key: string;
    vf: (() => any);
    control: AtomControl;
    element: HTMLElement;
    jq: boolean;
    com: AtomComponent;
    disp: AtomDispatcher;
    path: Array<{
        path: string;
        value: any;
    }>;
    pathList: Array<{
        path: string;
        value: any;
    }>[];
    /**
     *
     */
    constructor(control: AtomControl, element: HTMLElement, key: string, path: string, twoWays: NameValues, jq: boolean, vf: (() => any), events: string);
    onPropChanged(sender: NameValues, key: string): NameValues;
    onDataChanged(sender: any, key: string): NameValues;
    evaluate(target: any, path: Array<{
        path: string;
        value: any;
    }>): any;
    onValChanged(): any;
    setup(): void;
    setValue(value: any): any;
}
