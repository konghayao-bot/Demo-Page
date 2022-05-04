import { createMemo, createSignal, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "../style/dependence.css";
import type { NodeConfig, EdgeConfig } from "@antv/g6";
import { RenderMap } from "./RenderMap";
import { isURLString } from "../utils/isURLString";
import { RenderFileTree } from "./RenderFileTree";
import { ModuleStore, updateStore } from "./ModuleStore";
import { fromEventPattern, map } from "rxjs";
type NodeMeta = {
    id: string;
    imported: { uid: string }[];
    importedBy: { uid: string }[];
};
const RollupHub = (globalThis as any).RollupHub;
const Update = fromEventPattern(
    (handle) => RollupHub.on("drawDependence", handle),
    (handle) => RollupHub.off("drawDependence", handle)
);
export default function Dependence() {
    const [dependence, setDependence] = createSignal({
        nodes: [] as (NodeConfig & { name: string })[],
        edges: [] as EdgeConfig[],
    });
    const updater$ = Update.pipe(
        map(({ nodeMetas }: any) => {
            // console.log(nodeMetas);
            const edges: EdgeConfig[] = [];
            const nodes = Object.entries<NodeMeta>(nodeMetas).map(
                ([uid, value]) => {
                    edges.push(
                        ...value.imported.map((i) => {
                            return {
                                source: uid,
                                target: i.uid,
                            };
                        })
                    );
                    // 划分 两种不同的 加载模块
                    let type = "circle";
                    let fill = "blue";
                    if (value.id.startsWith(window.location.origin)) {
                    } else if (isURLString(value.id)) {
                        type = "remote";
                        fill = "green";
                    } else {
                        type = "local";
                        fill = "gray";
                    }
                    return {
                        id: uid,
                        type,
                        style: { fill },

                        name: value.id,
                        label: value.id.replace(/.*\//, ""),
                    };
                }
            );
            return { nodes, edges };
        })
    ).subscribe(setDependence);
    const fileTreeShow = createMemo(
        () => ModuleStore.dependence.renderFileTree.show
    );
    onCleanup(() => {
        updater$.unsubscribe();
    });
    return (
        <section class="flex flex-col bg-gray-50/20 backdrop-blur text-gray-700 p-2 overflow-y-auto h-full  items-center rounded-md ">
            <div class="text-xl flex justify-between w-full p-2 items-center">
                <span
                    onclick={() =>
                        updateStore(
                            "dependence",
                            "renderFileTree",
                            "show",
                            !fileTreeShow()
                        )
                    }
                    class="material-icons">
                    {fileTreeShow()
                        ? "keyboard_arrow_right"
                        : "keyboard_arrow_left"}
                </span>
                打包依赖关系图
                <span
                    class="material-icons"
                    onclick={() => updateStore("dependence", "show", false)}>
                    close
                </span>
            </div>
            <div class="flex-grow w-full flex overflow-hidden relative justify-center">
                <Show when={fileTreeShow()}>
                    <RenderFileTree data={dependence}></RenderFileTree>
                </Show>
                <RenderMap data={dependence}></RenderMap>
            </div>
        </section>
    );
}
