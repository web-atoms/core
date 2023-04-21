function *divide (text: string) {
    const regex = /^(([^\{\n]+\{)|([^\n]*\}))$/gm;
    let m;
    let sentOnce = false;
    let lastIndex = 0;
    let lastMatch;
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

        if (lastMatch.endsWith("}")) {
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

class StyleFragment {

    static newStyle( { selector = "", content = ""}) {
        return new StyleFragment( { selector, content })
    }

    private selector: string;
    private content: string;

    constructor({ selector, content }) {
        this.selector = selector;
        this.content = content;
    }

    expand(selector?) {
        selector ??= this.selector;

        let en = divide(this.content);

        let parts = en.next();

        if (parts.done) {
            return `${selector} {\n${this.content}\n}`;
        }

        const first = parts.value;

        let content = `${selector} {\n${first}\n}\n`;

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

            content += `${replaced} {\n${value}\n}\n`;
        }

        return content;
    }

    toString() {
        return this.expand();
    }

    installGlobal(selector: string = "") {
        const style = document.createElement("style");
        style.textContent = this.expand(selector);
        document.head.appendChild(style);
    }

    installLocal() {
        const selector = nextId();
        const style = document.createElement("style");
        const id = `.${selector}`;
        style.id = id;
        style.textContent = this.expand(id);
        document.head.appendChild(style);
        return selector;
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
