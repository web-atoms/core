import { RegisterSingleton } from "../../di/RegisterSingleton";
import { ModuleFiles } from "../../ModuleFiles";
import { BaseService, Get } from "../../services/http/RestService";

@RegisterSingleton
export class MovieService extends BaseService {

    @Get(ModuleFiles.src.web.samples.tabs.views.List_json)
    public async countryList(): Promise<any> {
        return null;
    }

}
