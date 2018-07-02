import { JsonService } from "../../services/JsonService";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export class JsonServiceTest extends AtomTest {

    @Test
    public parse(): void {
        // nothing..

        const t = `{ "date1": "/Date(1530518926876)/", "date2": "2018-07-02T08:09:48.045Z" }`;

        const s = new JsonService();

        const v = s.parse(t);

        Assert.isTrue(v.date1 instanceof Date);
        Assert.isTrue(v.date2 instanceof Date);

    }

    @Test
    public stringify(): void {
        const s = new JsonService();
        const j = s.stringify({
            key: "value",
            _$_handlers: [
                "h1", "h2"
            ]
        });

        const p = s.parse(j);

        Assert.isUndefined(p._$_handlers);
    }
}
