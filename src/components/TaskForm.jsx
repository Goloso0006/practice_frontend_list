import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const INITIAL_FORM = {
	title: '',
	description: '',
}

const taskSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'El titulo es obligatorio.')
		.max(200, 'El titulo no puede superar los 200 caracteres.'),
	description: z
		.string()
		.max(500, 'La descripcion no puede superar los 500 caracteres.')
		.optional(),
})

function TaskForm({ onSubmit, submitLabel = 'Agregar tarea', isSubmitting = false }) {
	const [submitError, setSubmitError] = useState('')
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(taskSchema),
		defaultValues: INITIAL_FORM,
	})

	const handleFormSubmit = async (formValues) => {
		setSubmitError('')

		try {
			await onSubmit({
				title: formValues.title.trim(),
				description: (formValues.description || '').trim(),
			})

			reset(INITIAL_FORM)
		} catch (submitError) {
			setSubmitError(submitError.message || 'No se pudo crear la tarea.')
		}
	}

	return (
		<form className="task-form" onSubmit={handleSubmit(handleFormSubmit)}>
			<div className="task-form__header">
				<p className="section-label">Nueva tarea</p>
				<h2>Captura una tarea y mantenla aislada por módulo</h2>
			</div>

			<label className="field">
				<span>Título</span>
				<input
					type="text"
					{...register('title', {
						onChange: () => setSubmitError(''),
					})}
					disabled={isSubmitting}
					placeholder="Ej. Conectar el backend"
				/>
				{errors.title ? <p className="field-error">{errors.title.message}</p> : null}
			</label>

			<label className="field">
				<span>Descripción</span>
				<textarea
					{...register('description', {
						onChange: () => setSubmitError(''),
					})}
					disabled={isSubmitting}
					placeholder="Notas opcionales para esta tarea"
					rows="4"
				/>
				{errors.description ? (
					<p className="field-error">{errors.description.message}</p>
				) : null}
			</label>

			{submitError ? <p className="field-error">{submitError}</p> : null}

			<button className="primary-button" type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Guardando...' : submitLabel}
			</button>
		</form>
	)
}

export default TaskForm
