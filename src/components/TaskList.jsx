import TaskItem from './TaskItem'

function TaskList({ tasks, onComplete, onDelete, onUpdate, isTaskProcessing }) {
	if (!tasks.length) {
		return (
			<div className="empty-state">
				<p className="section-label">Lista de tareas</p>
				<h2>No hay tareas activas</h2>
				<p>Todo lo pendiente ya paso al Cementerio de tareas.</p>
			</div>
		)
	}

	return (
		<div className="task-list">
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					onComplete={onComplete}
					onDelete={onDelete}
					onUpdate={onUpdate}
					isProcessing={isTaskProcessing(task.id)}
				/>
			))}
		</div>
	)
}

export default TaskList
