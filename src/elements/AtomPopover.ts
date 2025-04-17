const testNode = (node) => {
    let test; let cs = getComputedStyle(node);
    test = cs.getPropertyValue('position'); if ([
        'absolute', 'fixed'
    ].includes(test)) { return true; }
    test = cs.getPropertyValue('transform');   if (test != 'none')  { return true; }
    test = cs.getPropertyValue('perspective'); if (test != 'none')  { return true; }
    test = cs.getPropertyValue('perspective'); if (test != 'none')  { return true; }
    test = cs.getPropertyValue('filter');      if (test != 'none')  { return true; }
    test = cs.getPropertyValue('contain');     if (test == 'paint') { return true; }
    test = cs.getPropertyValue('will-change'); if ([
        'transform', 'perspective', 'filter'
    ].includes(test)) { return true; }
    return false;
}

const getContainingBlock = (node) => {
    if (node.parentElement) {
        if (node.parentElement == document.body) {
            return document.body;
        } else if (testNode(node.parentElement) == false) {
            return getContainingBlock(node.parentElement);
        } else { return node.parentElement; }
    } else { return null; }
}

import { AtomDisposableList } from "../core/AtomDisposableList";
import { CancelToken } from "../core/types";
import XNode, { xnodeSymbol } from "../core/XNode";
import { AtomControl } from "../web/controls/AtomControl";
import "./AtomPopover.css";

class AtomPopoverElement extends HTMLElement {


    timer: any;

    lastParent: HTMLElement;

    result: any;
    aborted = "cancel";

    connectedCallback() {

        // set defaults...

        setInterval(this.updatePosition, 1000);
        window.addEventListener("click", this.closePopover);
        this.updatePosition();
    }

    disconnectedCallback() {

        if(this.lastParent?.isConnected) {
            this.dispatchEvent(new CustomEvent("removed", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true
            }));
        }

        window.removeEventListener("click", this.closePopover);
        clearInterval(this.timer);
    }

    closePopover = (e: Event) => {

        const cancelOnBlur = /^(true|yes|1)$/i.test(this.getAttribute("cancel-on-blur") || "true");
        if (!cancelOnBlur) {
            return;
        }
        setTimeout(() => {
            // this is to let other event handlers handle clicks
            let target = e.target as HTMLElement;
            while(target) {
                if(target = this) {
                    return;
                }
                target = target.parentElement;
            }
            // click was outside
            this.lastParent = null;
            const ce = new CustomEvent("removing", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true,
                cancelable: true
            });
            this.dispatchEvent(ce);
            if (ce.defaultPrevented) {
                return;
            }
            this.dispatchEvent(new CustomEvent("removed", {
                detail: { result: this.result, aborted: this.aborted },
                bubbles: true,
            }));
            this.remove();
        }, 10);
    };

    updatePosition = () => {

        if (!this.parentElement) {
            clearInterval(this.timer);
            return;
        }

        const lastParent = this.lastParent = this.parentElement;
        if (!lastParent) {
            return;
        }

        const cb = getContainingBlock(lastParent) as HTMLElement;
        if (!cb) {
            return;
        }

        const rect = lastParent.getBoundingClientRect();

        const cbr = cb.getBoundingClientRect();

        const l = rect.x - cbr.x;
        const t = rect.y - cbr.y;

        const r = l + rect.width;
        const b = t + rect.height;

        const a = {
            "parent-left": `${l}px`,
            "parent-right": `${r}px`,
            "parent-top": `${t}px`,
            "parent-bottom": `${b}px`
        };

        
        let anchorBottom = this.getAttribute("anchor-bottom");
        let anchorRight = this.getAttribute("anchor-right");
        let anchorTop = this.getAttribute("anchor-top");
        let anchorLeft = this.getAttribute("anchor-left");

        const style = this.style;
        style.removeProperty("left");
        style.removeProperty("top");
        style.removeProperty("right");
        style.removeProperty("bottom");

        if (!anchorBottom) {
            anchorTop ||= "parent-bottom";
        }
        if (!anchorRight) {
            anchorLeft ||= "parent-right";
        }

        if (anchorTop) {
            style.top = a[anchorTop];
        }
        if (anchorBottom) {
            style.bottom = a[anchorBottom];
        }
        if (anchorLeft) {
            style.left = a[anchorLeft];
        }
        if (anchorRight) {
            style.right =a[anchorRight];
        }


    };

}

export default abstract class AtomPopover<T> {

    owner: AtomControl;

    popover: HTMLElement;

    result: any;

    disposables = new AtomDisposableList();

    static create(
        parent: HTMLElement | AtomControl,
        node: HTMLElement | XNode,
        cancelToken?: CancelToken
    ) {
        return new (this as any)(parent, cancelToken, node);
    }

    set renderer(v) {
        if (this.popover) {
            const owner = this.owner;
            let first = this.popover.firstElementChild as HTMLElement;
            while (first) {
                const next = first.nextElementSibling as HTMLElement;
                owner.dispose(first);
                first.remove();
                first = next;
            }
        }
        if (!v) {
            return;
        }
        // @ts-expect-error
        this.owner.render(v(), this.parent, this.owner);
    }

    constructor(
        private readonly parent: HTMLElement,
        cancelToken?: CancelToken,
        node?: HTMLElement | XNode
    ) {
        this.owner = AtomControl.from(parent);
        this.popover = document.createElement("atom-pop-over");
        parent.appendChild(this.popover);

        cancelToken?.registerForCancel(this.removing as any);

        this.popover.addEventListener("removing", this.removing);
        this.popover.addEventListener("removed", this.remove);
        this.disposables.add(() => {
            this.popover.removeEventListener("removed", this.remove);
            this.popover.removeEventListener("removing", this.removing);
        });

        this.init ??= () => {
            if (node) {
                this.renderer = () => node;
            }
        };

        const p = this.init?.();
        if (p?.then) {
            p.then(() => void 0, console.warn);
        }
    }

    abstract init();

    close(r) {
        (this.popover as any).result = r;
        this.popover.remove();
    }

    abstract cancel();

    removing = (ce?: Event) => {
        if (this.cancel) {
            ce?.preventDefault();
            const c = this.cancel?.();
            if (c?.then) {
                c.then(() => {
                    this.renderer = void 0;
                    this.remove();
                }, console.warn);
            }
        }
    };

    remove() {
        this.disposables.dispose();
        // dispose
        this.popover.remove();
    }

}

customElements.define("atom-pop-over", AtomPopoverElement);