import { useState } from 'react'

const INITIAL_FORM = {
	title: '',
	description: '',
}

function TaskForm({ onSubmit, submitLabel = 'Agregar tarea' }) {
	const [formValues, setFormValues] = useState(INITIAL_FORM)
	const [error, setError] = useState('')

	const handleChange = (event) => {
		const { name, value } = event.target

		setFormValues((currentValues) => ({
			...currentValues,
			[name]: value,
		}))

		if (error) {
			setError('')
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		const title = formValues.title.trim()
		const description = formValues.description.trim()

		if (!title) {
			setError('El título es obligatorio.')
			return
		}

		onSubmit({
			title,
			description,
		})

		setFormValues(INITIAL_FORM)
	}

	return (
		<form className="task-form" onSubmit={handleSubmit}>
			<div className="task-form__header">
				<p className="section-label">Nueva tarea</p>
				<h2>Captura una tarea y mantenla aislada por módulo</h2>
			</div>

			<label className="field">
				<span>Título</span>
				<input
					type="text"
					name="title"
					value={formValues.title}
					onChange={handleChange}
					placeholder="Ej. Conectar el backend"
				/>
			</label>

			<label className="field">
				<span>Descripción</span>
				<textarea
					name="description"
					value={formValues.description}
					onChange={handleChange}
					placeholder="Notas opcionales para esta tarea"
					rows="4"
				/>
			</label>

			{error ? <p className="field-error">{error}</p> : null}

			<button className="primary-button" type="submit">
				{submitLabel}
			</button>
		</form>
	)
}

export default TaskForm
