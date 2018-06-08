import { Assert, Category, Test, TestItem } from "../unit/base-test";
import { Inject } from "./Inject";
import { ServiceCollection } from "./ServiceCollection";
import { ServiceProvider } from "./ServiceProvider";

class GlobalClass {

    public id: number;

    constructor() {
        this.id = (new Date()).getTime();
    }

}

class DependentService {

    constructor(
        @Inject public g: GlobalClass,
        @Inject public sp: ServiceProvider
    ) {

    }

}

@Category("DI")
export class TestCase extends TestItem {

    @Test()
    public singleton(): void {

        ServiceCollection.instance.registerSingleton(GlobalClass);
        ServiceCollection.instance.registerSingleton(DependentService);

        const g1 =  ServiceProvider.global.get(GlobalClass);
        const g2 =  ServiceProvider.global.get(GlobalClass);

        Assert.equals(g1, g2);

        const ds = ServiceProvider.global.get(DependentService);
        Assert.equals(ds.g, g1);

        Assert.equals(ds.sp, ServiceProvider.global);
    }

}
