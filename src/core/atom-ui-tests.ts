import { Assert } from "../unit/Assert";
import { Category } from "../unit/Category";
import { Test } from "../unit/Test";
import { TestItem } from "../unit/TestItem";
import { AtomUI } from "../web/core/AtomUI";
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
