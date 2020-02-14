import Bind from "../../core/Bind";
import XNode from "../../core/XNode";

interface INativeElement<T> {
    vsProps: {
        [k in keyof this]?: this[k] | Bind
    } | { [k: string]: any } | {};
}

interface IBindablePartial<T, C = (new () => T)> {
    [P in keyof C]?: C[P];
    new (): INativeElement<T>;
};

function createNative<T, C = (new () => T)>(name: string, ctor: C):
    IBindablePartial<T, C> {
    const aa = ctor as any;
    aa.factory = (a?: any, ... nodes: XNode[]) => {
        return new XNode(name, { ... a }, nodes);
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

const DataTemplate = createNative("Web", class extends RootObject {
    public type: string;
});

const NativeElement = createNative("Native", class extends RootObject {

    public static itemTemplate = createNative("itemTemplate", DataTemplate);

    public label: string;
    public fontFamily: string;
});

const XF = {
    DataTemplate,
    NativeElement
};
export default XF;
