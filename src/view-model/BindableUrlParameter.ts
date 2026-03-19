import { BindableProperty } from "../core/BindableProperty.js";
import { AtomViewModel } from "./AtomViewModel.js";
import { registerInit } from "./baseTypes.js";
import bindUrlParameter from "./bindUrlParameter.js";

export default function BindableUrlParameter(name: string): any {
    return (target: AtomViewModel, key: string | string, descriptor: PropertyDecorator): void => {
        registerInit(target, (vm) => {
            bindUrlParameter(vm, key, name);
        });
        return BindableProperty(target, key);
    };
}
