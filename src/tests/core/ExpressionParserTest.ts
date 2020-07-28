import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { parsePath, parsePathLists } from "../../core/ExpressionParser";
import { AtomTest } from "../../unit/AtomTest";

export class ExpressionParserTest extends AtomTest {

    @Test
    public parse(): void {

        // tslint:disable-next-line:variable-name
        const _this: any = {};

        const p = parsePath(() => {

            _this.value = _this.v1 + _this.m2 ( _this.v2, _this.m4( _this.v3, _this.v4 ));
            for (const iterator of _this.v5) {
                _this.av = _this.v1 + _this.v2;
                // tslint:disable-next-line
                if (_this.v6 == _this.v7 && _this.v8=== _this.v9) {
                    // tslint:disable-next-line:no-console
                    console.log("ok");
                }
            }

        });

        // tslint:disable-next-line:no-console
        // console.log(JSON.stringify(p, undefined, 2));
        Assert.equals(9, p.filter( (px) => /^v/.test(px[0]) ).length );
        Assert.equals(0, p.filter( (px) => !/^v/.test(px[0]) ).length);

    }

    @Test
    public parseLambda(): void {
        const p = parsePath((a) => a.firstName + " " + a.lastName);
        Assert.equals(2, p.length);
    }

    @Test
    public parseLambdaText(): void {
        const p = parsePath("function(a) { return a.firstName + ' ' + a.lastName; }");
        Assert.equals(2, p.length);
    }

    @Test
    public parseLambdaES6Text(): void {
        const p = parsePath("(a) => a.firstName + ' ' + a.lastName");
        Assert.equals(2, p.length);
    }


    @Test
    public parseLambdaTextWithSecondParameter(): void {
        const p = parsePath("function(a, b) { return a.firstName + ' ' + a.lastName; }");
        Assert.equals(2, p.length);
    }

    @Test
    public parseLambdaTextWithComments(): void {
        const p = parsePath(`function(a) {
            // test a.firstName
            return a.firstName + ' ' + a.lastName;
        }`);
        Assert.equals(2, p.length);
    }

    @Test
    public parse1(): void {
        const p = parsePath(`function () {
            this.dateChange(this.month, this.year);
        }`);

        Assert.equals(2, p.length);
    }

    @Test
    public parse2(): void {
        const p = parsePath(`function () {
            this.dateChange(this["month"], this.year);
        }`);

        Assert.equals(1, p.length);
    }

    @Test
    public parseLongPath(): void {
        const p = parsePathLists(`function () {
            return _this.viewModel.comboBox.searchText;
        }`);

        Assert.equals(1, p.thisPath.length);
    }

    @Test
    public parseMultiPath(): void {
        const p = parsePathLists(`function () {
            return _this.viewModel && _this.viewModel.comboBox.searchText;
        }`);

        Assert.equals(1, p.thisPath.length);
    }

    @Test
    public parseMultiPath2(): void {
        const p = parsePathLists(`function () {
            return _this.viewModel && _this.viewModel.comboBox.searchText && _this.viewModel.comboBox.searchText1;
        }`);

        Assert.equals(2, p.thisPath.length);
    }

}
