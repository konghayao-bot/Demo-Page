import { For } from "solid-js";
import { ModuleDescription } from "../components/ModuleDescription";
import { CDN } from "../global";
import { Link } from "../router/index";

const pageList: ModuleDescription[] = await fetch(
    new URL("./script/PageList.json", CDN)
).then((res) => res.json());
export const PageList = () => {
    return (
        <div class="grid grid-cols-4 gap-2">
            <For each={pageList}>
                {(data) => <PageCard data={data}></PageCard>}
            </For>
        </div>
    );
};
const PageCard = (props: { data: ModuleDescription }) => {
    return (
        <div class="flex flex-col p-4 rounded-xl bg-white/80 backdrop-blur-md">
            <header>{props.data.title}</header>
            <div class="flex-grow">{props.data.desc}</div>
            <footer>
                <Link
                    href={`/page/${props.data.fileName}`}
                    element={<button>跳转</button>}></Link>
            </footer>
        </div>
    );
};
