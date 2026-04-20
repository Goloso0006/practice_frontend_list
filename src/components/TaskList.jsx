import TaskItem from './TaskItem'

function TaskList({ tasks, onToggleCompletion, onDelete, isTaskProcessing }) {
	if (!tasks.length) {
		return (
			<div className="empty-state">
				<p className="section-label">Lista de tareas</p>
				<h2>No hay tareas aún</h2>
				<p>La estructura ya está lista para empezar a conectar el backend.</p>
			</div>
		)
	}

	return (
		<div className="task-list">
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					onToggleCompletion={onToggleCompletion}
					onDelete={onDelete}
					isProcessing={isTaskProcessing(task.id)}
				/>
			))}
		</div>
	)
}

export default TaskList
