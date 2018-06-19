import { Category, Test, TestItem, Assert } from "../unit/base-test";
import { AtomGridView } from "./AtomGridView";

@Category("Grid view")
export class TestCase extends TestItem {

    @Test()
    public async test(): Promise<any> {
        const gv = new AtomGridView(document.createElement("section"));
        gv.columns = "20,*,50";
        gv.rows = "10,*,30%";
        gv.element.style.width = "1000px";
        gv.element.style.height = "1000px";

        const header = document.createElement("header");
        const headerAny = header as any;
        headerAny.row = 0;
        headerAny.column = 0;
        headerAny.colSpan = 3;

        gv.append(header);

        const footer = document.createElement("footer");
        const footerAny = footer as any;
        footerAny.row = 2;
        footerAny.column = 0;
        footerAny.colSpan = 3;

        gv.append(footer);

        const left = document.createElement("div");
        const leftAny = left as any;
        leftAny.row = 1;
        leftAny.column = 0;

        gv.append(left);

        const right = document.createElement("div");
        const rightAny = right as any;
        rightAny.row = 1;
        rightAny.column = 2;

        gv.append(right);

        const fill = document.createElement("div");
        const fillAny = fill as any;
        fillAny.row = 1;
        fillAny.column = 1;

        gv.append(fill);

        gv.invalidate();

        await this.delay(100);

        const hps = header.parentElement.style;

        Assert.equals("0px", hps.left);
        Assert.equals("0px", hps.top);
        Assert.equals("1000px" , hps.width);
        Assert.equals("10px", hps.height);

        const lps = left.parentElement.style;

        Assert.equals("0px", lps.left);
        Assert.equals("10px", lps.top);
        Assert.equals("20px" , lps.width);
        Assert.equals("690px", lps.height);

        const rps = right.parentElement.style;

        Assert.equals("950px", rps.left);
        Assert.equals("10px", rps.top);
        Assert.equals("50px" , rps.width);
        Assert.equals("690px", rps.height);

        const fillps = fill.parentElement.style;

        Assert.equals("20px", fillps.left);
        Assert.equals("10px", fillps.top);
        Assert.equals("930px" , fillps.width);
        Assert.equals("690px", fillps.height);

        const footerps = footer.parentElement.style;

        Assert.equals("0px", footerps.left);
        Assert.equals("700px", footerps.top);
        Assert.equals("1000px" , footerps.width);
        Assert.equals("300px", footerps.height);
    }

}
