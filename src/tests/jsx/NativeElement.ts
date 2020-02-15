import Bind from "../../core/Bind";
import { IClassOf } from "../../core/types";
import XNode from "../../core/XNode";

function createNative<T, C = (new () => T)>(
    name: string,
    ctor: C,
    isProperty?: boolean,
    isTemplate?: boolean):
    C & {
        [K in keyof C]: C[K];
    } {
    const aa = ctor as any;
    aa.factory = (a?: any, ... nodes: XNode[]) => {
        return new XNode(name, { ... a }, nodes, isProperty, isTemplate);
    };
    aa.toString = () => {
        return name;
    };
    return aa;
}

class RootObject {
    public get vsProps(): {
        [k in keyof this]?: this[k] | Bind
    } | { [k: string]: any } | {} {
        return undefined;
    }
}

function TypeName(type: any) {
    return (c) => {
        c.factory = (a?: any, ... nodes: XNode[]) => {
            return new XNode(type, a, nodes);
        };
        c.toString = () => type;
    };
}

@TypeName("WebAtoms.DataTemplate;WebAtoms")
class DataTemplate extends RootObject {
    public type: string;
}

/**
 * Class NativeElement
 */
@TypeName("WebAtoms.NativeElement;WebAtoms")
class NativeElement extends RootObject {

    public static itemTemplate = createNative("itemTemplate", DataTemplate, true, true);

    public label: string;
    public fontFamily: string;
}

/**
 * Class Derived
 */
@TypeName("WebAtoms.Derived;WebAtoms")
class Derived extends NativeElement {
    public other: string;
}

const XF = {
    DataTemplate,
    NativeElement,
    Derived
};
export default XF;