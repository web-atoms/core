import { AtomUI } from "./atom-ui";
import { TestItem, Category, Test, Assert } from "../unit/base-test";
import { NameValues } from "./types";


@Category("atom-ui")
export class TestUnit extends TestItem {

    @Test()
    run():void{
        var a:NameValues = AtomUI.parseUrl("a=b&c=1");
        Assert.equals("b",a["a"]);
        Assert.equals(1, a["c"]);
    }
}