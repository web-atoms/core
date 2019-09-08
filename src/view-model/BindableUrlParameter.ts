import { BindableProperty } from "../core/BindableProperty";
import { AtomViewModel } from "./AtomViewModel";
import { registerInit } from "./baseTypes";
import bindUrlParameter from "./bindUrlParameter";

export default function BindableUrlParameter(name: string): any {
    return (target: AtomViewModel, key: string | string, descriptor: PropertyDecorator): void => {
        registerInit(target, (vm) => {
            bindUrlParameter(vm, key, name);
        });
        return BindableProperty(target, key);
    };
}
