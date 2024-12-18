import { Batch, ProcessFiles, Run } from "@neurospeech/jex";
import path from "node:path";

const lessCPath = path.resolve("node_modules/less/bin/lessc");

export default <Batch>
    <ProcessFiles
        src="src/**/*.less"
        dest="dist/"
        command={( { file, dest}) =>
            <Batch>
                <Run
                    cmd={process.execPath}
                    args={[
                        lessCPath,
                        "--source-map=" + dest.path + ".css.map",
                        file.path,
                        dest.path + ".css"
                    ]}
                    />
                </Batch>
            }
        />
</Batch>;