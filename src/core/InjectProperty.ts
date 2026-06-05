import { Inject } from "../di/Inject.js";

 /** @deprecated use `@Inject` instead */
export default function InjectProperty(target, name) {
    console.warn("InjectProperty is deprecated");
    return Inject(target, name)
}