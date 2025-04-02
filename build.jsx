import { Batch, ProcessFiles, Run } from "@neurospeech/jex";
import path from "node:path";

const postCssPath = path.resolve("node_modules/postcss-cli/index.js");

export default <Batch>
    <ProcessFiles
        src="src/**/*.css"
        base="src"
        dest="dist"
        command={( { file, dest}) =>
            <Batch>
                <Run
                    cmd={process.execPath}
                    args={[
                        postCssPath,
                        file.path,
                        "-o", dest.path,
                        "--map"
                    ]}
                    />
                </Batch>
            }
        />
</Batch>;