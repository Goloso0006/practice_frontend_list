export const TASK_API_BASE_URL = 'https://backend-list-task.onrender.com'

export const TASK_ENDPOINTS = {
	tasks: `${TASK_API_BASE_URL}/tasks`,
	taskById: (taskId) => `${TASK_API_BASE_URL}/tasks/${taskId}`,
}
