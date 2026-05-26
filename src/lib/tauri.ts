import type { EventCallback } from "@tauri-apps/api/event";
import { type DragDropEvent, getCurrentWebview } from "@tauri-apps/api/webview";

export async function listenDragAndDrop(handler: EventCallback<DragDropEvent>) {
	const destroy = await getCurrentWebview().onDragDropEvent(handler);

	return destroy;
}
