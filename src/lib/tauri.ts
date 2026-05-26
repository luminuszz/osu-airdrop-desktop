import { getCurrentWebview } from "@tauri-apps/api/webview";
import { readFile } from "@tauri-apps/plugin-fs";
import { extractAndFormatFileNameByPath } from "./utils";

export async function listenDragAndDrop(handler: (_: File[]) => void) {
	const destroy = await getCurrentWebview().onDragDropEvent(
		async ({ payload }) => {
			if (payload.type === "drop") {
				const files = await Promise.all(
					payload.paths.map(async (path) => {
						const fileData = await readFile(path);
						const fileName = extractAndFormatFileNameByPath(path);

						return new File([fileData], fileName);
					}),
				);

				handler(files);
			}
		},
	);

	return destroy;
}
