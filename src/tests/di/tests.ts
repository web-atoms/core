import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { App } from "../../App";
import { Inject } from "../../di/Inject";
import { ServiceCollection } from "../../di/ServiceCollection";
import { ServiceProvider } from "../../di/ServiceProvider";

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

    @Test
    public singleton(): void {

        const app = new App();

        ServiceCollection.instance.registerSingleton(GlobalClass);
        ServiceCollection.instance.registerSingleton(DependentService);

        const g1 =  app.get(GlobalClass);
        const g2 =  app.get(GlobalClass);

        Assert.equals(g1, g2);

        const ds = app.get(DependentService);
        Assert.equals(ds.g, g1);

        Assert.equals(ds.sp, app);
    }

}
