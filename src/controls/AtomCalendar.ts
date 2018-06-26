
import { App } from "../App";
import { Atom } from "../atom";
import { AtomBinder, bindableProperty } from "../core";
import { Inject } from "../di/Inject";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomCalendar extends AtomItemsControl {

//    @bindableProperty
//     public mValue: any;

    @bindableProperty
    public month: number;

    @bindableProperty
    public year: number = 0;

    @bindableProperty
    public startYear: number = -5;

    @bindableProperty
    public endYear: number = 0;

    @bindableProperty
    public currentYear: number = 0;

    public  visibleDate: undefined = undefined;

    private mCurrentYear: number;
    private mEndYear: number;
    private  mStartYear: number;
    private  mYear: number;
    private mMonth: number;

    private mCreated: any;

    private mVisibleDate: any;

    public set Month(v) {
        this.mMonth = v;
        this.updateCalendar();
    }

    public set Year(v) {
        this.mYear = v;
        this.updateCalendar();
    }
    public set VisibleDate(v) {
        if (!v) {
            return;
        }
        if (v === this.mVisibleDate) {
            return;
        }
        this.mVisibleDate = v;
        this.mYear = v.getFullYear();
        this.mMonth = v.getMonth() + 1;
        this.updateCalendar();
        AtomBinder.refreshValue(this, "year");
        AtomBinder.refreshValue(this, "month");
    }

    public updateCalendar() {
        if (!this.mCreated) {
            return;
        }
        // tslint:disable-next-line:prefer-const
        let now = new Date();

        const d = new Date(this.mYear, this.mMonth - 1, 1);
        const first = new Date(this.mYear, this.mMonth - 1, 1);

        if (first.getDay()) {
            // go to first day of the month...
            let start = first.getDay() - 1;
            start = -start;

            first.setDate(start);
        }

        const m = first.getMonth();
        const y = first.getFullYear();

        const items = [];

     //   let i = 0;

        const cm = this.mMonth - 1;

        const daytimes = [];
        // tslint:disable-next-line:no-shadowed-variable
        for (let j: number = 0; j <= 23; j++) {
                let a = "AM";
                let n = j;
                if (j > 11) {
                    a = "PM";
                    if (j > 12) {
                        n = j - 12;
                    }
                }
                const item = n + ":00 " + a;
                daytimes.push(item);

    }

        for (let i: number = 0; i < 42; i++) {
            const cd = i + first.getDate();
            const id = new Date(y, m, cd);
            const w = id.getDay();
            let weekends: boolean = false;
            weekends = (w === 0 || w === 6);
            items.push({
                label: id.getDate(),
                isWeekEnd: weekends,
                isToday:
                    now.getDate() === id.getDate()
                    && now.getMonth() === id.getMonth()
                    && now.getFullYear() === id.getFullYear(),
                isOtherMonth: id.getMonth() !== cm,
             //   dateLabel: AtomDate.toShortDateString(id),
             //   value: AtomDate.toMMDDYY(id),
                date: id,
                daytimes: {daytimes}
            });
        }

        AtomBinder.setValue(this, "items", items);
    }
    // public onCreated:() {
    //     baseType.onCreated.call(this);
    //     const self = this;
    //     WebAtoms.dispatcher.callLater(function () {
    //         self.updateCalendar();
    //     });
    // },

    public changeMonth(n) {
        let m = this.mMonth;
        m += n;
        if (m > 12) {
            m = 1;
            this.year = this.mYear + 1;
           // Atom.set(this, "year", this.mYear + 1);
        }
        if (m === 0) {
            this.year = this.mYear - 1;
           // Atom.set(this, "year", this.mYear - 1);
            m = 12;
        }
        AtomBinder.setValue(this, "month", m);
    }

    protected preCreate(): void {
        const today = new Date();
        this.mMonth = today.getMonth() + 1;
        this.mYear = today.getFullYear();
        this.mStartYear = -5;
        this.mEndYear = 10;

        this.mCurrentYear = (new Date()).getFullYear();
    }

    // public init() {
    //    // baseType.init.call(this);
    //     let _this = this;
    //     this.nextMonthCommand = function () {
    //         _this.changeMonth(1);
    //     };
    //     this.prevMonthCommand = function () {
    //         _this.changeMonth(-1);
    //     };
    // }

}
