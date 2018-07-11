import { PropertyBinding } from "../../core/PropertyBinding";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

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
                fromSource(v: any[]): any {
                    return parseInt(v[0], 10);
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
