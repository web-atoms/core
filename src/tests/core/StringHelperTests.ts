import { StringHelper } from "../../core/StringHelper";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";
export class StringHelperTest extends AtomTest {
    @Test
    public camelToHyphen(): void {
        Assert.equals("this", StringHelper.fromCamelToHyphen("this"));
        Assert.equals("this-is-test", StringHelper.fromCamelToHyphen("thisIsTest"));
        Assert.equals("this-is-sample-test", StringHelper.fromCamelToHyphen("thisIsSampleTest"));
    }
}
