import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosProgressEvent } from "axios";
import { osuBackend } from "@/lib/api";
import type { MutationOptionsHelper } from "@/lib/react-query";
import { storage } from "@/lib/storage";
import { fetchFilesQueryKey } from "../queries/use-fetch-files";

async function requestUploadUrl(filename: string, filetype: string) {
	const { data } = await osuBackend.post<{ uploadUrl: string; fileId: string }>(
		"/files/upload/request",
		{
			filename,
			filetype,
		},
	);

	return data;
}

async function confirmUploadFile(fileId: string, filename: string) {
	const deviceId = storage.get("deviceId");

	if (!deviceId) throw new Error("Device ID not found");

	await osuBackend.post("/files/upload/confirm", {
		fileId,
		originalFilename: filename,
		deviceId,
	});
}

type UploadFileParams = {
	file: File;
	uploadListener?: (payload: AxiosProgressEvent) => void;
};

async function uploadFile({ file, uploadListener }: UploadFileParams) {
	const { uploadUrl, fileId } = await requestUploadUrl(file.name, file.type);

	await axios.put<{
		uploadUrl: string;
		fileId: string;
	}>(uploadUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
		onUploadProgress: uploadListener,
	});

	await confirmUploadFile(fileId, file.name);
}

function useUploadFile(options?: MutationOptionsHelper<typeof uploadFile>) {
	const client = useQueryClient();

	return useMutation({
		...options,
		onSuccess() {
			void client.invalidateQueries({ queryKey: fetchFilesQueryKey });
		},
		mutationFn: uploadFile,
		mutationKey: ["upload-file"],
	});
}

export {
	confirmUploadFile,
	requestUploadUrl,
	type UploadFileParams,
	uploadFile,
	useUploadFile,
};
