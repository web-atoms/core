import { IMockOrInject } from "./IMockOrInject.js";
import { Register } from "./Register.js";
import { Scope } from "./ServiceCollection.js";

export default function DITransient(mockOrInject?: IMockOrInject): ((target: any) => void) {
    return (target: any): void => {
        Register({scope: Scope.Transient, mockOrInject})(target);
    };
}
