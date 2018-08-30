import { IMockOrInject } from "./IMockOrInject";
import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export default function DITransient(mockOrInject?: IMockOrInject): ((target: any) => void) {
    return (target: any): void => {
        Register({scope: Scope.Transient, mockOrInject})(target);
    };
}
