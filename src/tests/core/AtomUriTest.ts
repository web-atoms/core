import { AtomUri } from "../../core/AtomUri";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

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
