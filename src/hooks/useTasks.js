import { useCallback, useEffect, useState } from 'react'
import {
	createTask as createTaskRequest,
	deleteTask as deleteTaskRequest,
	getAllTasks,
	updateTask as updateTaskRequest,
} from '../api/taskApi'

export default function useTasks() {
	const [tasks, setTasks] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [processingTaskIds, setProcessingTaskIds] = useState([])
	const [error, setError] = useState('')

	const beginTaskProcessing = (taskId) => {
		setProcessingTaskIds((currentIds) => {
			if (currentIds.includes(taskId)) {
				return currentIds
			}

			return [...currentIds, taskId]
		})
	}

	const finishTaskProcessing = (taskId) => {
		setProcessingTaskIds((currentIds) =>
			currentIds.filter((currentId) => currentId !== taskId),
		)
	}

	const loadTasks = useCallback(async () => {
		setError('')
		setIsLoading(true)

		try {
			const apiTasks = await getAllTasks()
			setTasks(Array.isArray(apiTasks) ? apiTasks : [])
		} catch (loadError) {
			setError(loadError.message || 'No se pudieron cargar las tareas.')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadTasks()
	}, [loadTasks])

	const addTask = async (taskData) => {
		setError('')
		setIsSubmitting(true)

		try {
			const createdTask = await createTaskRequest(taskData)
			setTasks((currentTasks) => [createdTask, ...currentTasks])
		} catch (createError) {
			const errorMessage = createError.message || 'No se pudo crear la tarea.'
			setError(errorMessage)
			throw new Error(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	const toggleTaskCompletion = async (taskId) => {
		const taskToUpdate = tasks.find((task) => task.id === taskId)

		if (!taskToUpdate) {
			return
		}

		setError('')
		beginTaskProcessing(taskId)

		try {
			const updatedTask = await updateTaskRequest(taskId, {
				title: taskToUpdate.title,
				description: taskToUpdate.description,
				completed: !taskToUpdate.completed,
			})

			setTasks((currentTasks) =>
				currentTasks.map((task) =>
					task.id === taskId ? updatedTask : task,
				),
			)
		} catch (updateError) {
			setError(updateError.message || 'No se pudo actualizar la tarea.')
		} finally {
			finishTaskProcessing(taskId)
		}
	}

	const removeTask = async (taskId) => {
		setError('')
		beginTaskProcessing(taskId)

		try {
			await deleteTaskRequest(taskId)
			setTasks((currentTasks) =>
				currentTasks.filter((task) => task.id !== taskId),
			)
		} catch (deleteError) {
			setError(deleteError.message || 'No se pudo eliminar la tarea.')
		} finally {
			finishTaskProcessing(taskId)
		}
	}

	const isTaskProcessing = (taskId) => processingTaskIds.includes(taskId)

	const completedTasks = tasks.filter((task) => task.completed).length
	const pendingTasks = tasks.length - completedTasks

	return {
		tasks,
		isLoading,
		isSubmitting,
		error,
		completedTasks,
		pendingTasks,
		loadTasks,
		isTaskProcessing,
		addTask,
		toggleTaskCompletion,
		removeTask,
	}
}
