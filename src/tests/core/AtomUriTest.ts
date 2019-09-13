import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { AtomUri } from "../../core/AtomUri";
import { AtomTest } from "../../unit/AtomTest";

export class AtomUriTest extends AtomTest {

    @Test
    public parse(): void {

        const fullUrlString = "https://localhost:8080/folder/file?a=b&c=d#aa=bb";

        const fullUrl = new AtomUri(fullUrlString);

        Assert.equals("8080", fullUrl.port);

        Assert.equals(fullUrlString, fullUrl.toString());

        fullUrl.path = "/folder1/file";

        Assert.equals("https://localhost:8080/folder1/file?a=b&c=d#aa=bb", fullUrl.toString());

    }

}
