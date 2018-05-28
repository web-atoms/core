import { Assert, Category, Test, TestItem } from "../unit/base-test";
import { AtomUI } from "./atom-ui";
import { INameValues } from "./types";

@Category("atom-ui")
export class TestUnit extends TestItem {

    @Test()
     public run(): void {
        const a: INameValues = AtomUI.parseUrl("a=b&c=1");
        Assert.equals("b", a.a);
        Assert.equals(1, a.c);
    }
}
