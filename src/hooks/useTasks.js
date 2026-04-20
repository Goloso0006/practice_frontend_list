import { useState } from 'react'

const INITIAL_TASKS = [
	{
		id: 1,
		title: 'Definir la arquitectura inicial',
		description: 'Separar API, hooks, componentes y páginas.',
		completed: true,
	},
	{
		id: 2,
		title: 'Preparar la base visual',
		description: 'Crear una interfaz clara para el flujo principal.',
		completed: false,
	},
	{
		id: 3,
		title: 'Dejar listo el punto de integración',
		description: 'Centralizar el acceso al backend en una sola capa.',
		completed: false,
	},
]

let nextTaskId = INITIAL_TASKS.length + 1

function createTask(taskData) {
	return {
		id: nextTaskId++,
		title: taskData.title,
		description: taskData.description,
		completed: false,
	}
}

export default function useTasks() {
	const [tasks, setTasks] = useState(INITIAL_TASKS)

	const addTask = (taskData) => {
		setTasks((currentTasks) => [createTask(taskData), ...currentTasks])
	}

	const toggleTaskCompletion = (taskId) => {
		setTasks((currentTasks) =>
			currentTasks.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task,
			),
		)
	}

	const removeTask = (taskId) => {
		setTasks((currentTasks) =>
			currentTasks.filter((task) => task.id !== taskId),
		)
	}

	const completedTasks = tasks.filter((task) => task.completed).length
	const pendingTasks = tasks.length - completedTasks

	return {
		tasks,
		completedTasks,
		pendingTasks,
		addTask,
		toggleTaskCompletion,
		removeTask,
	}
}
