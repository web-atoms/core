import Bind from "../../core/Bind";
import { IClassOf } from "../../core/types";
import XNode, { RootObject } from "../../core/XNode";

const NSWebAtoms = XNode.namespace("WebAtoms", "WebAtoms");

@NSWebAtoms("WebAtoms.DataTemplate")
class DataTemplate extends RootObject {
    public type: string;
}

/**
 * Class NativeElement
 */
@NSWebAtoms("WebAtoms.NativeElement")
export class NativeElement extends RootObject {

    public static itemTemplate = XNode.template(DataTemplate);

    public label: string;
    public fontFamily: string;
}

@NSWebAtoms("WebAtoms.Grid")
class Grid extends RootObject {

    public static row = XNode.attached(Number);

}

/**
 * Class Derived
 */
@NSWebAtoms("WebAtoms.Derived")
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
