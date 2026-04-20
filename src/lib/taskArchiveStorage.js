const STORAGE_KEY = 'frontend-todolist:completed-task-times'

export const ARCHIVE_TTL_MS = 15 * 60 * 1000

function readStorage() {
	if (typeof window === 'undefined') {
		return {}
	}

	try {
		const rawValue = window.localStorage.getItem(STORAGE_KEY)
		return rawValue ? JSON.parse(rawValue) : {}
	} catch {
		return {}
	}
}

function writeStorage(value) {
	if (typeof window === 'undefined') {
		return
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function getTaskCompletedAt(taskId) {
	const archiveMap = readStorage()
	return archiveMap[String(taskId)] ?? null
}

export function setTaskCompletedAt(taskId, timestamp = Date.now()) {
	const archiveMap = readStorage()
	archiveMap[String(taskId)] = timestamp
	writeStorage(archiveMap)
	return timestamp
}

export function clearTaskCompletedAt(taskId) {
	const archiveMap = readStorage()
	delete archiveMap[String(taskId)]
	writeStorage(archiveMap)
}