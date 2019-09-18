import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import MarkdownService from "../../../web/services/MarkdownService";

export default class MarkdownServiceTest extends TestItem {

    @Test
    public test(): void {
        const ms = new MarkdownService();
        Assert.equals("<em>a</em> <strong>b</strong>", ms.toHtml("_a_ __b__"));
        Assert.equals("<em>a</em> nl<br/> <strong>b</strong>", ms.toHtml("_a_ nl\n __b__"));
    }

}
