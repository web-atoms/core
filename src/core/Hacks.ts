import type { AtomControl } from "../web/controls/AtomControl";
import { ChildEnumerator } from "../web/core/AtomUI";
import { AtomBinder } from "./AtomBinder";
import { IDisposable } from "./types";

export const visitDescendents = (element: HTMLElement, action: (e: HTMLElement, ac: AtomControl) => boolean): void => {

    for (const iterator of ChildEnumerator.enumerate(element)) {            
        const eAny = iterator as any;
        const ac = eAny ? eAny.atomControl : undefined;
        if (!action(iterator, ac)) {
            continue;
        }
        visitDescendents(iterator, action);
    }
}

export const refreshInherited = (target: AtomControl, name: string, fieldName?: string )  => {
    AtomBinder.refreshValue(target, name);
    if (!fieldName) {
        fieldName = "m" + name[0].toUpperCase() + name.substr(1);
    }
    if (!target.element) {
        return;
    }
    visitDescendents(target.element, (e, ac) => {
        if (ac) {
            if (ac[fieldName] === undefined) {
                refreshInherited(ac as any, name, fieldName);
            }
            return false;
        }
        return true;
    });
}

export const watchProperty = (element: HTMLElement, name: string, events: string[], f: (v: any) => void): IDisposable => {
    if (events.indexOf("change") === -1) {
        events.push("change");
    }

    const l = (e) => {
        const e1 = element as HTMLInputElement;
        const v = e1.type === "checkbox" ? e1.checked : e1.value;
        f(v);
    };
    for (const iterator of events) {
        element.addEventListener(iterator, l , false);
    }

    return {
        dispose: () => {
            for (const iterator of events) {
                element.removeEventListener(iterator, l, false);
            }
        }
    };
}

export const setValue = (element: HTMLElement, name: string, value: any) => {
    element[name] = value;
}