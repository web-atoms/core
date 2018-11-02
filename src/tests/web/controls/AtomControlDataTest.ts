import { Assert } from "../../../unit/Assert";
import { Test } from "../../../unit/Test";
import { AtomControl } from "../../../web/controls/AtomControl";
import AtomWebTest from "../AtomWebTest";

export class AtomControlDataTest extends AtomWebTest {

    @Test
    public async data(): Promise<any> {

        const root = new AtomControl(this.app);

        const child = new AtomControl(this.app);

        const a = {};

        root.data = a;

        root.append(child);

        Assert.equals(a, child.data);

    }

    @Test
    public async dataInherited(): Promise<any> {

        const root = new AtomControl(this.app);

        const child = new AtomControl(this.app);

        const a = {};

        root.append(child);

        root.data = a;

        Assert.equals(a, child.data);

    }

    @Test
    public async dataUndefined(): Promise<any> {

        const root = new AtomControl(this.app);

        Assert.isUndefined(root.data);

    }

}
