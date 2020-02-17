import Bind from "../../core/Bind";
import { IClassOf } from "../../core/types";
import XNode from "../../core/XNode";

class RootObject {
    public get vsProps(): {
        [k in keyof this]?: this[k] | Bind
    } | { [k: string]: any } | {} {
        return undefined;
    }
}

function template<T>(type: IClassOf<T>): IClassOf<T> {
    return {
        factory: true,
        isTemplate: true,
    } as unknown as IClassOf<T>;
}

function attached<T>(type: IClassOf<T>): (n: T) => {[key: string]: any} {
    return {
        factory: true,
        attached: true
    } as any as (n: T) => {[key: string]: any};
}

function namespace(ns: string) {
    return (type: any) => {
        return (c) => {
            for (const key in type) {
                if (type.hasOwnProperty(key)) {
                    const element = type[key];
                    if (element) {
                        const n = type + ":" + key;
                        if (element.factory) {
                            type[key] = {
                                factory(a?: any, ... nodes: XNode[]) {
                                    return new XNode(n, a, nodes, true, element.isTemplate);
                                },
                                toString() {
                                    return n;
                                }
                            };
                        } else {
                            type[key] = (a) => ({
                                [n]: a
                            });
                        }
                    }
                }
            }

            c.factory = (a?: any, ... nodes: XNode[]) => {
                return new XNode(type, a, nodes);
            };
            c.toString = () => type;
        };
    };
}

const Type = namespace("WebAtoms");

@Type("WebAtoms.DataTemplate")
class DataTemplate extends RootObject {
    public type: string;
}

/**
 * Class NativeElement
 */
@Type("WebAtoms.NativeElement")
export class NativeElement extends RootObject {

    public static itemTemplate = template(DataTemplate);

    public label: string;
    public fontFamily: string;
}

@Type("WebAtoms.Grid")
class Grid extends RootObject {

    public static row = attached(Number);

}

/**
 * Class Derived
 */
@Type("WebAtoms.Derived")
class Derived extends NativeElement {
    public other: string;
}

const XF = {
    DataTemplate,
    NativeElement,
    Derived,
    Grid
};
export default XF;
