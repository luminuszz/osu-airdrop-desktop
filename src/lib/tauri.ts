import { dirname } from "@tauri-apps/api/path";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { readFile } from "@tauri-apps/plugin-fs";
import { openPath } from "@tauri-apps/plugin-opener";
import { open } from "@tauri-apps/plugin-shell";
import { extractAndFormatFileNameByPath } from "./utils";

export type OsFile = {
	osPath: string;
	file: File;
};

export async function listenDragAndDrop(handler: (_: OsFile[]) => void) {
	const destroy = await getCurrentWebview().onDragDropEvent(
		async ({ payload }) => {
			if (payload.type === "drop") {
				const files = await Promise.all(
					payload.paths.map(async (path) => {
						const fileData = await readFile(path);
						const fileName = extractAndFormatFileNameByPath(path);

						return {
							osPath: path,
							file: new File([fileData], fileName),
						};
					}),
				);

				handler(files);
			}
		},
	);

	return destroy;
}

export async function openFile(filePath: string) {
	try {
		open(filePath);
	} catch (error) {
		console.error("Erro ao tentar abrir o arquivo:", error);
	}
}

export async function openFileFolder(savePath: string) {
	try {
		const folderPath = await dirname(savePath);

		await openPath(folderPath);
	} catch (error) {
		console.error("Erro ao tentar abrir a pasta:", error);
	}
}
