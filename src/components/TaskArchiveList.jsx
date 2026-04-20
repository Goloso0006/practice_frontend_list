import TaskArchiveItem from './TaskArchiveItem'

function TaskArchiveList({ tasks, onRestore, onDelete, isTaskProcessing }) {
	if (!tasks.length) {
		return (
			<div className="empty-state">
				<p className="section-label">Cementerio de tareas</p>
				<h2>No hay tareas archivadas</h2>
				<p>Las tareas completadas apareceran aqui y se borraran solas al cumplir 15 minutos.</p>
			</div>
		)
	}

	return (
		<div className="task-list">
			{tasks.map((task) => (
				<TaskArchiveItem
					key={task.id}
					task={task}
					onRestore={onRestore}
					onDelete={onDelete}
					isProcessing={isTaskProcessing(task.id)}
				/>
			))}
		</div>
	)
}

export default TaskArchiveList