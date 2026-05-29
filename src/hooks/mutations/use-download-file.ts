import { useMutation } from "@tanstack/react-query";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import axios from "axios";
import { osuBackend } from "@/lib/api";
import type { MutationOptionsHelper } from "@/lib/react-query";
import { openFileFolder } from "@/lib/tauri";

export async function requestDownloadUrl(fileId: string) {
	const { data } = await osuBackend.get<{ url: string }>(
		`/files/download/${fileId}`,
	);

	return data.url;
}

export async function downloadFileByUrl({
	originalFilename,
	fileId,
}: {
	fileId: string;
	originalFilename: string;
}) {
	try {
		const url = await requestDownloadUrl(fileId);

		const pathToSave = await save({
			defaultPath: originalFilename,
			title: "Salvar como",
		});

		if (!pathToSave) {
			throw new Error("Download canceled");
		}

		const downloadResponse = await axios.get(url, {
			responseType: "arraybuffer",
		});

		const fileBuffer = new Uint8Array(downloadResponse.data);

		await writeFile(pathToSave, fileBuffer);

		await openFileFolder(pathToSave);
	} catch (e) {
		console.log(e);
	}
}

type MutationOptions = MutationOptionsHelper<typeof downloadFileByUrl>;

export function useDownloadFile(options?: MutationOptions) {
	return useMutation({
		...options,
		mutationFn: downloadFileByUrl,
	});
}
