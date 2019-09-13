import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { PropertyBinding } from "../../core/PropertyBinding";
import { AtomTest } from "../../unit/AtomTest";

class SourceClass {

    public source: string = "5";
}

class DestinationClass {

    public destination: number;
}

export class PropertyBinderTest extends AtomTest {

    @Test
    public twoWayBindingTest(): void {
        const source = new SourceClass();
        const destination = new DestinationClass();

        const pb = new PropertyBinding(
            destination,
            null,
            "destination",
            [["this", "source"]],
            true, {
                fromSource(v): any {
                    return parseInt(v, 10);
                },
                fromTarget(v: any): any {
                    return v + "";
                }
            }, source
        );

        Assert.equals(5, destination.destination);

        destination.destination = 10;
        Assert.equals("10", source.source);
    }

}
