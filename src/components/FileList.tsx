import { compareDesc } from "date-fns";
import { useFetchFiles } from "@/hooks/queries/use-fetch-files";
import { useStorageValue } from "@/hooks/use-storaged";
import { FileItem } from "./FileItem";

export function FileList() {
	const [deviceId] = useStorageValue("deviceId");

	const { data: files } = useFetchFiles();

	return (
		<div className="space-y-2">
			{files
				?.sort((a, b) => compareDesc(a.createdAt, b.createdAt))
				.map((it, index) => (
					<FileItem
						key={it.id}
						isNew={index === 0}
						isOut={it.sender.id === deviceId}
						it={it}
					/>
				))}
		</div>
	);
}
