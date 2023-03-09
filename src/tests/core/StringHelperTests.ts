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

    @Test
    public escapeRegExp() {
        Assert.equals("a\\(",  StringHelper.escapeRegExp("a("));
    }

    @Test
    public createContainsRegExp() {
        let r = StringHelper.createContainsRegExp("a");
        Assert.isTrue(r.test("sas"));
        r = StringHelper.createContainsRegExp("(a)");
        Assert.isTrue(r.test("(a) (b)"));
        Assert.isFalse(r.test("(a(c)) (b)"));
    }

    @Test
    public createContainsAnyWordRegExp() {
        const r = StringHelper.createContainsAnyWordRegExp("Was iS");
        Assert.isTrue(r.test("I was eating"));
        Assert.isTrue(r.test("He is eating"));
    }

    @Test
    public containsIgnoreCase() {
        Assert.isFalse(StringHelper.containsIgnoreCase("", "no"));
        Assert.isTrue(StringHelper.containsIgnoreCase("no", ""));
        Assert.isTrue(StringHelper.containsIgnoreCase("yes", "eS"));
    }

    @Test
    public containsAnyWordIgnoreCase() {
        Assert.isFalse(StringHelper.containsAnyWordIgnoreCase("", "no"));
        Assert.isTrue(StringHelper.containsAnyWordIgnoreCase("no", ""));
        Assert.isTrue(StringHelper.containsAnyWordIgnoreCase("I was eating", "Was Am"));
        Assert.isTrue(StringHelper.containsAnyWordIgnoreCase("I am eating", "Was Am"));
        Assert.isFalse(StringHelper.containsAnyWordIgnoreCase("I wa eating", "Was Am"));
        Assert.isFalse(StringHelper.containsAnyWordIgnoreCase("I m eating", "Was Am"));
    }

}
