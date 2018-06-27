import { TestItem } from "./TestItem";
import { TestMethod } from "./TestMethod";
import { TestRunner } from "./TestRunner";

export function Test(name?: string): (target: TestItem, propertyKey: string, descriptor: any) => void {
    return (target: TestItem, propertyKey: string, descriptor: any): void => {

        // console.log(`Test called for ${target.constructor.name} in ${propertyKey}`)
        TestRunner.instance.tests.push(new TestMethod(
            name || propertyKey,
            propertyKey,
            target.constructor.name,
            target.constructor ));
    };
}
