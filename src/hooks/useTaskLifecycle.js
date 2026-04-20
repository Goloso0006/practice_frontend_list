import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useTasks from './useTasks'
import {
	ARCHIVE_TTL_MS,
	clearTaskCompletedAt,
	getTaskCompletedAt,
	setTaskCompletedAt,
} from '../lib/taskArchiveStorage'

const ARCHIVE_REFRESH_INTERVAL_MS = 30000

function buildArchivedTask(task, now) {
	const completedAt = getTaskCompletedAt(task.id) ?? now
	const expiresAt = completedAt + ARCHIVE_TTL_MS

	return {
		...task,
		completedAt,
		expiresAt,
		remainingMs: Math.max(0, expiresAt - now),
	}
}

export default function useTaskLifecycle() {
	const taskState = useTasks()
	const { tasks, updateTask, removeTask } = taskState
	const [now, setNow] = useState(Date.now())
	const purgingTaskIdsRef = useRef(new Set())

	const activeTasks = useMemo(
		() => tasks.filter((task) => !task.completed),
		[tasks],
	)

	const archivedTasks = useMemo(
		() => tasks.filter((task) => task.completed).map((task) => buildArchivedTask(task, now)),
		[tasks, now],
	)

	useEffect(() => {
		const completedTasks = tasks.filter((task) => task.completed)

		completedTasks.forEach((task) => {
			if (!getTaskCompletedAt(task.id)) {
				setTaskCompletedAt(task.id, now)
			}
		})
	}, [now, tasks])

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setNow(Date.now())
		}, ARCHIVE_REFRESH_INTERVAL_MS)

		return () => window.clearInterval(intervalId)
	}, [])

	const deleteTaskForever = useCallback(
		async (taskId) => {
			if (purgingTaskIdsRef.current.has(taskId)) {
				return
			}

			purgingTaskIdsRef.current.add(taskId)

			try {
				await removeTask(taskId)
				clearTaskCompletedAt(taskId)
			} finally {
				purgingTaskIdsRef.current.delete(taskId)
			}
		},
		[removeTask],
	)

	const markTaskAsCompleted = useCallback(
		async (taskId) => {
			const taskToComplete = tasks.find((task) => task.id === taskId)

			if (!taskToComplete) {
				return
			}

			await updateTask(taskId, {
				title: taskToComplete.title,
				description: taskToComplete.description,
				completed: true,
			})

			setTaskCompletedAt(taskId)
		},
		[tasks, updateTask],
	)

	const restoreTask = useCallback(
		async (taskId) => {
			const taskToRestore = tasks.find((task) => task.id === taskId)

			if (!taskToRestore) {
				return
			}

			await updateTask(taskId, {
				title: taskToRestore.title,
				description: taskToRestore.description,
				completed: false,
			})

			clearTaskCompletedAt(taskId)
		},
		[tasks, updateTask],
	)

	useEffect(() => {
		if (!archivedTasks.length) {
			return
		}

		const expiredTasks = archivedTasks.filter((task) => task.remainingMs <= 0)

		if (!expiredTasks.length) {
			return
		}

		void Promise.all(expiredTasks.map((task) => deleteTaskForever(task.id)))
	}, [archivedTasks, deleteTaskForever])

	const archiveCount = archivedTasks.length
	const activeCount = activeTasks.length
	const totalCount = tasks.length

	return {
		...taskState,
		activeTasks,
		archivedTasks,
		activeCount,
		archiveCount,
		totalCount,
		markTaskAsCompleted,
		restoreTask,
		deleteTaskForever,
	}
}