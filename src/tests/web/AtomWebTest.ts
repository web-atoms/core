import "test-dom";
import { AtomTest } from "../../unit/AtomTest";
import { AtomGridView } from "../../web/controls/AtomGridView";
import { AtomStyleSheet } from "../../web/styles/AtomStyleSheet";
import { AtomTheme } from "../../web/styles/AtomTheme";

export default class AtomWebTest extends AtomTest {

    constructor() {
        super();
        this.app.put(AtomTheme, this.app.resolve(AtomTheme));
        this.app.put(AtomStyleSheet, this.app.resolve(AtomTheme));

    }

    protected createPage(): void {

        const grid = new AtomGridView(this.app);

    }

}
