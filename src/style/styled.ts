function *divide (text: string) {
    const regex = /^(([^\{\n]+\{[\t\x20]*)|([^\n\}]*\}[\t\x20]*))$/gm;
    let m;
    let sentOnce = false;
    let lastIndex = 0;
    let lastMatch: string;
    while((m = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const match = m[0];
        if(!sentOnce) {
            // send first text ..
            // send current ..
            sentOnce = true;
            yield text.substring(lastIndex, m.index);
            lastIndex = m.index + match.length;
            lastMatch = match;
            continue;
        }

        if (lastMatch.includes("}")) {
            yield [lastMatch];
            lastIndex = m.index + match.length;
            lastMatch = match;
            continue;
        }

        yield [lastMatch, text.substring(lastIndex, m.index), match];
        lastIndex = m.index + match.length;
        lastMatch = match;
    }

    if(lastMatch?.endsWith("}")) {
        yield [lastMatch];
    }
};


let id = 1;

const nextId = () => `styled-r${id++}`;

const globalLow = document.createElement("meta");
globalLow.name = "low-priority-style";
document.head.appendChild(globalLow);

const global = document.createElement("meta");
global.name = "global-priority-style";
document.head.appendChild(global);

const globalHigh = document.createElement("meta");
globalHigh.name = "global-high-priority-style";
document.head.appendChild(globalHigh);

const localLow = document.createElement("meta");
localLow.name = "local-low-priority-style";
document.head.appendChild(localLow);

const local = document.createElement("meta");
local.name = "local-priority-style";
document.head.appendChild(local);

const localHigh = document.createElement("meta");
localHigh.name = "high-priority-style";
document.head.appendChild(localHigh);

class StyleFragment {

    static newStyle( { selector = "", content = ""}) {
        return new StyleFragment( { selector, content })
    }

    private selector: string;
    private content: string;
    private id?: string;
    private description?: string;
    private order: string = "default";

    constructor({ selector, content }) {
        this.selector = selector;
        this.content = content;
    }

    expand(selector?) {
        selector ??= this.selector;

        let en = divide(this.content);

        let parts = en.next();

        if (parts.done) {
            if (!this.content) {
                return "";
            }
            return `${selector} {\n${this.content}\n}`;
        }

        const first = parts.value as string;

        let content = first?.trim()
            ? `${selector} {\n${first}\n}\n`
            : "";

        let selectorStack = [];

        while (!(parts = en.next()).done) {
            const [key, value] = parts.value as string[];

            if (key.endsWith("}")) {
                selector = selectorStack.pop();
                continue;
            }

            let keySelector = key.replace("{", "");

            const replaced = keySelector.replace(/\&/g, selector).trim();
            // push stack...
            selectorStack.push(selector);
            selector = replaced;                

            // only add rule if it is not empty...
            if (value?.trim()) {
                content += `${replaced} {\n${value}\n}\n`;
            }
        }

        return content;
    }

    toString() {
        return this.content.replace(/\\n/g,"");
    }

    /**
     * Installs style globally, without appending it with any class
     * @param selector global selector if any
     * @param id id of style element
     * @param description description if any
     */
    installGlobal(selector: string = "", id: string = this.id || selector, description?: string) {
        const style = document.createElement("style");
        style.textContent = this.expand(selector);
        if (description) {
            style.setAttribute("data-desc", description);
        }
        document.head.appendChild(style);
        style.id = id;
    }

    /**
     * Installs style with an auto generated class name
     * @param prefix prefix of an element if any
     * @param description description if any
     * @returns string
     */
    installLocal(prefix: string = "", description: string = this.description) {
        const selector = nextId();
        const style = document.createElement("style");
        const id = `${prefix}.${selector}`;
        style.id = id;
        style.textContent = this.expand(id);
        if (description) {
            style.setAttribute("data-desc", description);
        }
        document.head.appendChild(style);
        return selector;
    }

    withId(id: string) {
        this.id = id;
        return this;
    }
    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withOrder(order: "low" | "high") {
        this.order = order;
        return this;
    }
}

export type IStyleFragments = {
    [key: string]: StyleFragment;
};

export type IStyleFragmentSet = {
    [key: string]: IStyleFragments;
}

const styles: IStyleFragmentSet[] = [];

const styled = {

    get styles() {
        return styles;
    },

    css: (t: TemplateStringsArray, ... a: any[]) => {
        let r = "";
        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            r += element;
            if (index < a.length) {
                r += a[index];
            }
        }
        return StyleFragment.newStyle( { content: r });
    },

    add(x: IStyleFragmentSet) {
        styles.push(x);
    },
};

export default styled;
