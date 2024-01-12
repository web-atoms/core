import Test from "@web-atoms/unit-test/dist/Test";
import { AtomTest } from "../../unit/AtomTest";
import Route from "../../core/Route";
import Assert from "@web-atoms/unit-test/dist/Assert";

export default class RouteTest extends AtomTest {

    @Test
    public parse() {
        let r = Route.create("/public/jobs/{id?}");
        let p = r.matches("/public/jobs/3");
        Assert.equals("3", p.id);

        p = r.matches("/public/jobs/a%20b");
        Assert.equals("a b", p.id);

        r = Route.create("/public/jobs/{id:number?}");
        p = r.matches("/public/jobs/3");
        Assert.equals(3, p.id);

        Assert.isNull(r.matches("/public/jobs/a"));

        Assert.isNotNull(r.matches("/public/jobs"));
    }

    
    @Test
    public parseMultiple() {
        let r = Route.create("/feed/posts/{id}/{c}");
        let p = r.matches("/feed/posts/3/5");
        Assert.equals("3", p.id);
        Assert.equals("5", p.c);

        Assert.isNull(r.matches("/feed/posts/4"));

    }

    @Test
    public parseMultipleOptional() {
        let r = Route.create("/feed/posts/{id}/{c?}");
        let p = r.matches("/feed/posts/3/5");
        Assert.equals("3", p.id);
        Assert.equals("5", p.c);

        p = r.matches("/feed/posts/4");
        Assert.equals("4", p.id);
        Assert.equals(void 0, p.c);

    }

    @Test
    public parseAll() {
        let r = Route.create("/preview/{*all}");
        let p = r.matches("/preview/posts/3/5");
        Assert.equals("posts/3/5", p.all);
    }

    @Test
    public parseQueryString() {
        let r = Route.create("/feed/post/{id?}", ["a"]);
        let p = r.matches("/feed/post/3", new URLSearchParams("a=4"));
        Assert.equals("3", p.id);
        Assert.equals("4", p.a);
        p = r.matches("/feed/posts/3", new URLSearchParams("a=4"));
        Assert.isNull(p);

        let url = r.substitute({ id: 2, a: 9});
        Assert.equals("/feed/post/2?a=9&", url);

        r = Route.create("/feed/post/{id?}", ["a={anchor}"]);
        p = r.matches("/feed/post/3", new URLSearchParams("a=4"));
        Assert.equals("3", p.id);
        Assert.equals("4", p.anchor);
        p = r.matches("/feed/posts/3", new URLSearchParams("a=4"));
        Assert.isNull(p);

        url = r.substitute({ id: 2, anchor: 9});
        Assert.equals("/feed/post/2?a=9&", url);
    }

}
