import { Atom } from "../Atom";
import { CancelToken } from "../core/types";
import { Assert } from "../unit/Assert";
import { AtomTest } from "../unit/AtomTest";
import { Test } from "../unit/Test";

export class AtomClassTest extends AtomTest {

    @Test
    public async postAsync(): Promise<any> {
        const r = await Atom.postAsync(this.app, async () => {
            await Atom.delay(100);
            return "test";
        });

        Assert.equals("test", r);

        try {
            await Atom.postAsync(this.app, async () => {
                await Atom.delay(1);
                throw new Error("error");
            });
        } catch (e) {
            Assert.equals("error", e.message);
        }
    }

    @Test
    public encode(): void {

        let url = Atom.encodeParameters({ a: { b: null }, c: 1 });

        Assert.equals(`a=%7B%22b%22%3Anull%7D&c=1`, url);

        url = Atom.encodeParameters({ a: null, d: undefined, c: 1 });
        Assert.equals(`c=1`, url);

        url = Atom.encodeParameters({ a: null, d: undefined, c: new Date(Date.UTC(2001, 0, 1, 0, 0, 0, 0))});
        Assert.equals(`c=2001-01-01T00%3A00%3A00.000Z`, url);
    }

    @Test
    public url(): void {

        let url = Atom.url(null);
        Assert.isNull(url);

        url = Atom.url("a", { b: "c" });
        Assert.equals("a?b=c", url);

        url = Atom.url("a?b=c", { d: "e" });
        Assert.equals("a?b=c&d=e", url);

        url = Atom.url("a", null,  { d: "e" });
        Assert.equals("a#d=e", url);

        url = Atom.url("a#b=c", null,  { d: "e" });
        Assert.equals("a#b=c&d=e", url);
    }

    @Test
    public async atomDelay(): Promise<any> {
        await Atom.delay(10);

        const ct = new CancelToken();
        const p = Atom.delay(10, ct);

        ct.cancel();

        try {
            await p;
        } catch (e) {
            Assert.equals("cancelled", e.message);
        }

        try {
            await Atom.delay(0, ct);
        } catch (e) {
            Assert.equals("cancelled", e.message);
        }
    }

    @Test
    public getMethod(): void {

        Assert.isUndefined(Atom.get({}, "a"));

        Assert.isNull(Atom.get({a: null}, "a"));

        Assert.isNull(Atom.get(null, "a"));

        Assert.isUndefined(Atom.get(undefined, "a"));

        Assert.equals("a", Atom.get({ a: {b: "a"}}, "a.b"));

        Assert.isUndefined(Atom.get({a: {}}, "a.b"));

        Assert.isNull(Atom.get({a: {b: null}}, "a.b"));
    }

}
