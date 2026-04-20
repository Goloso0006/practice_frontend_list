function TaskItem({ task, onToggleCompletion, onDelete, isProcessing = false }) {
	return (
		<article className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
			<div className="task-item__content">
				<button
					type="button"
					className="task-item__toggle"
					onClick={() => onToggleCompletion(task.id)}
					disabled={isProcessing}
					aria-pressed={task.completed}
					aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
				>
					{isProcessing ? 'Actualizando...' : task.completed ? 'Completada' : 'Pendiente'}
				</button>

				<div>
					<h3>{task.title}</h3>
					{task.description ? <p>{task.description}</p> : null}
				</div>
			</div>

			<button
				type="button"
				className="task-item__delete"
				onClick={() => onDelete(task.id)}
				disabled={isProcessing}
			>
				Eliminar
			</button>
		</article>
	)
}

export default TaskItem
