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

}

class VM {

    @Inject
    public readonly propertyService: PropertyService;

    // constructor(@Inject private service: Service) {

    // }

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
