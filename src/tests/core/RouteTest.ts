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

        p = r.matches("/public/jobs/a+b");
        Assert.equals("a+b", p.id);

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
    public parseAll() {
        let r = Route.create("/preview/{*all}");
        let p = r.matches("/preview/posts/3/5");
        Assert.equals("posts/3/5", p.all);
    }

}
