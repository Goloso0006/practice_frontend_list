import { useState } from 'react'

function TaskItem({ task, onComplete, onDelete, onUpdate, isProcessing = false }) {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(task.title)
	const [description, setDescription] = useState(task.description || '')
	const [editError, setEditError] = useState('')

	const startEditing = () => {
		setIsEditing(true)
		setEditError('')
		setTitle(task.title)
		setDescription(task.description || '')
	}

	const cancelEditing = () => {
		setIsEditing(false)
		setEditError('')
		setTitle(task.title)
		setDescription(task.description || '')
	}

	const saveChanges = async () => {
		const sanitizedTitle = title.trim()
		const sanitizedDescription = description.trim()

		if (!sanitizedTitle) {
			setEditError('El titulo es obligatorio.')
			return
		}

		try {
			await onUpdate(task.id, {
				title: sanitizedTitle,
				description: sanitizedDescription,
			})
			setIsEditing(false)
			setEditError('')
		} catch (updateError) {
			setEditError(updateError.message || 'No se pudo editar la tarea.')
		}
	}

	if (isEditing) {
		return (
			<article className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
				<div className="task-item__content">
					<div className="field">
						<span>Titulo</span>
						<input
							type="text"
							value={title}
							onChange={(event) => {
								setTitle(event.target.value)
								if (editError) {
									setEditError('')
								}
							}}
							disabled={isProcessing}
						/>
					</div>

					<div className="field">
						<span>Descripcion</span>
						<textarea
							rows="3"
							value={description}
							onChange={(event) => {
								setDescription(event.target.value)
								if (editError) {
									setEditError('')
								}
							}}
							disabled={isProcessing}
						/>
					</div>

					{editError ? <p className="field-error">{editError}</p> : null}
				</div>

				<div className="task-item__actions">
					<button
						type="button"
						className="primary-button"
						onClick={saveChanges}
						disabled={isProcessing}
					>
						{isProcessing ? 'Guardando...' : 'Guardar'}
					</button>
					<button
						type="button"
						className="task-item__toggle"
						onClick={cancelEditing}
						disabled={isProcessing}
					>
						Cancelar
					</button>
				</div>
			</article>
		)
	}

	return (
		<article className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
			<div className="task-item__content">
				<button
					type="button"
					className="task-item__toggle"
					onClick={() => onComplete(task.id)}
					disabled={isProcessing}
					aria-label="Marcar como completada"
				>
					{isProcessing ? 'Completando...' : 'Completada'}
				</button>

				<div>
					<h3>{task.title}</h3>
					{task.description ? <p>{task.description}</p> : null}
				</div>
			</div>

			<div className="task-item__actions">
				<button
					type="button"
					className="task-item__toggle"
					onClick={startEditing}
					disabled={isProcessing}
				>
					Editar
				</button>
				<button
					type="button"
					className="task-item__delete"
					onClick={() => onDelete(task.id)}
					disabled={isProcessing}
				>
					Eliminar
				</button>
			</div>
		</article>
	)
}

export default TaskItem
