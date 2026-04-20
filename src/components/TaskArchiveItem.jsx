function formatTimeRemaining(remainingMs) {
	const safeRemainingMs = Math.max(0, remainingMs)
	const totalSeconds = Math.ceil(safeRemainingMs / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function TaskArchiveItem({ task, onRestore, onDelete, isProcessing = false }) {
	return (
		<article className="task-item task-item--archive">
			<div className="task-item__content">
				<span className="archive-badge">Borradores</span>

				<div>
					<h3>{task.title}</h3>
					{task.description ? <p>{task.description}</p> : <p>Sin descripcion</p>}
					<p className="archive-meta">
						Se elimina automaticamente en {formatTimeRemaining(task.remainingMs)}
					</p>
				</div>
			</div>

			<div className="task-item__actions">
				<button
					type="button"
					className="task-item__toggle"
					onClick={() => onRestore(task.id)}
					disabled={isProcessing}
				>
					Restaurar
				</button>
				<button
					type="button"
					className="task-item__delete"
					onClick={() => onDelete(task.id)}
					disabled={isProcessing}
				>
					Eliminar ahora
				</button>
			</div>
		</article>
	)
}

export default TaskArchiveItem