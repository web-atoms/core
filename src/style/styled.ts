function *divide (text: string) {
    const regex = /^(([^\{\n]+\{[\t\x20]*)|([^\n\}]*\}[^\S\n\r]*))$/gm;
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
            yield [lastMatch.trim()];
            lastIndex = m.index + match.length;
            lastMatch = match;
            continue;
        }

        yield [lastMatch, text.substring(lastIndex, m.index), match];
        lastIndex = m.index + match.length;
        lastMatch = match;
    }

    if(lastMatch?.includes("}")) {
        yield [lastMatch.trim()];
    }
};


let id = 1;

const nextId = () => `styled-r${id++}`;

let first = document.head.firstElementChild;

const addMarker = (name) => {
    const m = document.createElement("meta");
    m.name = name;
    if (first) {
        first.insertAdjacentElement("afterend", m);
    } else {
        document.head.insertAdjacentElement("afterbegin", m);
    }
    first = m;
    return m;
}

const globalLow = addMarker("global-low-style");
const global = addMarker("global-style");
const globalHigh = addMarker("global-high-style");

const localLow = addMarker("local-low-style");
const local = addMarker("local-style");
const localHigh = addMarker("local-high-style");

// export type IStyleFragment = Partial<StyleFragment>;

class StyleFragment {

    static newStyle( { selector = "", content = ""}) {
        return new StyleFragment( { selector, content }) as Partial<StyleFragment>;
    }

    private selector: string;
    private content: string;
    private id?: string;
    private description?: string;
    private order: string = "low";

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
                if (selector === "@") {
                    content += "\n}\n";
                    selector = selectorStack.pop();
                }
                continue;
            }

            let keySelector = key.replace("{", "");

            const isMedia = /\@/.test(keySelector);

            const replace = !isMedia;

            const replaced = replace
                ? selector.split(",").map((x) => keySelector.replace(/\&/g, x).trim()).join(",")
                : keySelector;

            // const replaced = keySelector.replace(/\&/g, selector).trim();
            // push stack...
            selectorStack.push(selector);
            selector = replace ? replaced : selector;
            if (isMedia) {
                selectorStack.push("@");
            }

            // only add rule if it is not empty...
            if (value?.trim()) {
                content += `${replaced} {\n${value}\n}\n`;
            } else {
                if (isMedia) {
                    content += `${replaced} {\n`;
                }
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
        switch(this.order) {
            case "low":
                document.head.insertBefore(style, globalLow);
                break;
            case "default":
            case "medium":
                document.head.insertBefore(style, global);
                break;
            case "high":
                document.head.insertBefore(style, globalHigh);
                break;
        }
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
        switch(this.order) {
            case "low":
                document.head.insertBefore(style, localLow);
                break;
            case "default":
            case "medium":
                document.head.insertBefore(style, local);
                break;
            case "high":
                document.head.insertBefore(style, localHigh);
                break;
        }
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

    /**
     * Order of installation.
     * 
     * @param order low | medium | high - default is low
     * @returns 
     */
    withOrder(order: "low" | "medium" | "high") {
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

export const svgAsCssDataUrl = (text: string) => `url(${JSON.stringify(`data:image/svg+xml,${text}`)})`;
