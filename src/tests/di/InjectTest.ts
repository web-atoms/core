import DISingleton from "../../di/DISingleton";
import { Inject } from "../../di/Inject";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export default class InjectTest extends AtomTest {

    @Test
    public propertyInjection(): void {

        const vm = this.app.resolve(VM, true) as VM;

        const first = vm.propertyService.time;

        const vm2 = this.app.resolve(VM, true) as VM;

        const second = vm2.propertyService.time;

        Assert.equals(first, second);

    }

    @Test
    public propertyInjectionWithConstructor(): void {
        const vm = this.app.resolve(VM2, true) as VM2;

        const first = vm.propertyService.time;

        const vm2 = this.app.resolve(VM2, true) as VM2;

        const second = vm2.propertyService.time;

        Assert.equals(first, second);
    }

    @Test
    public inheritedPropertyTest(): void {
        const bvm = this.app.resolve(BaseVM, true) as BaseVM;

        const bvm2 = this.app.resolve(BaseVM, true) as BaseVM;

        const bf = bvm.service.time;
        const bf2 = bvm.service.time;

        Assert.equals(bf, bf2);

        // child

        const cvm = this.app.resolve(ChildVM, true) as ChildVM;
        const cvm2 = this.app.resolve(ChildVM, true) as ChildVM;

        const cf = cvm.service.time;
        const cf2 = cvm2.service.time;

        Assert.equals(cf, cf2);

        const cs = cvm.propertyService.time;
        const cs2 = cvm2.propertyService.time;

        Assert.equals(cs, cs2);
    }
}

@DISingleton()
class Service {
    public time: number;

    constructor() {
        this.time = (new Date()).getTime();
    }

}

@DISingleton()
class PropertyService {

    public time: number;

    constructor() {
        this.time = (new Date()).getTime();
    }
}

class VM {

    @Inject
    public readonly propertyService: PropertyService;

    // constructor(@Inject private service: Service) {

    // }

}

class VM2 {

    @Inject
    public readonly propertyService: PropertyService;

    constructor(@Inject private service: Service) {

    }

}

class BaseVM {

    @Inject public service: Service;

}

class ChildVM extends BaseVM {

    @Inject public propertyService: PropertyService;

}
