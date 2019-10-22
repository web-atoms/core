import { IValueConverter } from "../core/IValueConverter";
import { PropertyBinding } from "../core/PropertyBinding";
import { IDisposable } from "../core/types";
import { AtomViewModel } from "./AtomViewModel";

/**
 * Binds source property to target property with optional two ways
 * @param target target whose property will be set
 * @param propertyName name of target property
 * @param source source to read property from
 * @param path property path of source
 * @param twoWays optional, two ways {@link IValueConverter}
 */
export default function bindProperty(
    vm: AtomViewModel,
    target: any,
    propertyName: string,
    source: any,
    path: string[][],
    twoWays?: IValueConverter | ((v: any) => any) ): IDisposable {
    const pb = new PropertyBinding(
        target,
        null,
        propertyName,
        path,
        (twoWays && typeof twoWays !== "function") ? true : false , twoWays, source);
    return vm.registerDisposable(pb);
}
