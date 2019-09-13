import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { StringHelper } from "../../core/StringHelper";
import { AtomTest } from "../../unit/AtomTest";
export class StringHelperTest extends AtomTest {
    @Test
    public camelToHyphen(): void {
        Assert.equals("this", StringHelper.fromCamelToHyphen("this"));
        Assert.equals("this-is-test", StringHelper.fromCamelToHyphen("thisIsTest"));
        Assert.equals("this-is-sample-test", StringHelper.fromCamelToHyphen("thisIsSampleTest"));
    }

    @Test
    public camelToPascal(): void {
        Assert.equals("This", StringHelper.fromCamelToPascal("this"));
        Assert.equals("ThisIsTest", StringHelper.fromCamelToPascal("thisIsTest"));
        Assert.equals("ThisIsSampleTest", StringHelper.fromCamelToPascal("thisIsSampleTest"));
    }

    @Test
    public pascalToCamel(): void {
        Assert.equals("this", StringHelper.fromPascalToCamel("This"));
        Assert.equals("thisIsTest", StringHelper.fromPascalToCamel("ThisIsTest"));
        Assert.equals("thisIsSampleTest", StringHelper.fromPascalToCamel("ThisIsSampleTest"));
    }
}
