import { useState } from 'react'
import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {
	createTask as createTaskRequest,
	deleteTask as deleteTaskRequest,
	getAllTasks,
	updateTask as updateTaskRequest,
} from '../api/taskApi'

const TASKS_QUERY_KEY = ['tasks']

export default function useTasks() {
	const queryClient = useQueryClient()
	const [error, setError] = useState('')
	const [processingTaskIds, setProcessingTaskIds] = useState([])

	const {
		data: tasks = [],
		isLoading,
		error: loadError,
	} = useQuery({
		queryKey: TASKS_QUERY_KEY,
		queryFn: getAllTasks,
	})

	const createTaskMutation = useMutation({
		mutationFn: createTaskRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
		},
	})

	const updateTaskMutation = useMutation({
		mutationFn: ({ taskId, taskData }) => updateTaskRequest(taskId, taskData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
		},
	})

	const deleteTaskMutation = useMutation({
		mutationFn: deleteTaskRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
		},
	})

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

	const addTask = async (taskData) => {
		setError('')

		try {
			await createTaskMutation.mutateAsync(taskData)
		} catch (createError) {
			const errorMessage = createError.message || 'No se pudo crear la tarea.'
			setError(errorMessage)
			throw new Error(errorMessage)
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
			await updateTaskMutation.mutateAsync({
				taskId,
				taskData: {
				title: taskToUpdate.title,
				description: taskToUpdate.description,
				completed: !taskToUpdate.completed,
				},
			})
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
			await deleteTaskMutation.mutateAsync(taskId)
		} catch (deleteError) {
			setError(deleteError.message || 'No se pudo eliminar la tarea.')
		} finally {
			finishTaskProcessing(taskId)
		}
	}

	const isTaskProcessing = (taskId) => processingTaskIds.includes(taskId)
	const isSubmitting = createTaskMutation.isPending
	const displayError = error || loadError?.message || ''

	const completedTasks = tasks.filter((task) => task.completed).length
	const pendingTasks = tasks.length - completedTasks

	return {
		tasks,
		isLoading,
		isSubmitting,
		error: displayError,
		completedTasks,
		pendingTasks,
		isTaskProcessing,
		addTask,
		toggleTaskCompletion,
		removeTask,
	}
}
