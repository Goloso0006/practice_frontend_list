const DEFAULT_TASK_API_BASE_URL = 'https://backend-list-task.onrender.com'

export const TASK_API_BASE_URL =
	import.meta.env.VITE_API_URL?.trim() || DEFAULT_TASK_API_BASE_URL

export const TASK_ENDPOINTS = {
	tasks: `${TASK_API_BASE_URL}/tasks`,
	taskById: (taskId) => `${TASK_API_BASE_URL}/tasks/${taskId}`,
}

const DEFAULT_HEADERS = {
	Accept: 'application/json',
}

function getErrorMessage(errorPayload, statusCode) {
	if (errorPayload && typeof errorPayload === 'object') {
		if (typeof errorPayload.message === 'string' && errorPayload.message.trim()) {
			return errorPayload.message
		}

		if (typeof errorPayload.error === 'string' && errorPayload.error.trim()) {
			return errorPayload.error
		}
	}

	if (typeof errorPayload === 'string' && errorPayload.trim()) {
		return errorPayload
	}

	return `Request failed with status ${statusCode}`
}

async function parseResponse(response) {
	const contentType = response.headers.get('content-type') || ''
	const hasJson = contentType.includes('application/json')

	if (!response.ok) {
		let errorPayload = null

		if (hasJson) {
			errorPayload = await response.json().catch(() => null)
		} else {
			errorPayload = await response.text().catch(() => '')
		}

		throw new Error(getErrorMessage(errorPayload, response.status))
	}

	if (response.status === 204) {
		return null
	}

	if (!hasJson) {
		return null
	}

	return response.json()
}

function normalizeTaskPayload(taskData) {
	const title = taskData.title?.trim() || ''

	if (!title) {
		throw new Error('El titulo es obligatorio.')
	}

	if (title.length > 200) {
		throw new Error('El titulo no puede superar los 200 caracteres.')
	}

	return {
		title,
		description: taskData.description?.trim() || '',
		completed: Boolean(taskData.completed),
	}
}

async function request(method, url, body) {
	const options = {
		method,
		headers: { ...DEFAULT_HEADERS },
	}

	if (typeof body !== 'undefined') {
		options.headers['Content-Type'] = 'application/json'
		options.body = JSON.stringify(body)
	}

	const response = await fetch(url, options)
	return parseResponse(response)
}

export async function getAllTasks() {
	return request('GET', TASK_ENDPOINTS.tasks)
}

export async function createTask(taskData) {
	return request('POST', TASK_ENDPOINTS.tasks, normalizeTaskPayload(taskData))
}

export async function updateTask(taskId, taskData) {
	return request(
		'PUT',
		TASK_ENDPOINTS.taskById(taskId),
		normalizeTaskPayload(taskData),
	)
}

export async function deleteTask(taskId) {
	return request('DELETE', TASK_ENDPOINTS.taskById(taskId))
}
