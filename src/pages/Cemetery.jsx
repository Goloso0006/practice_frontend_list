import TaskArchiveList from '../components/TaskArchiveList'
import useTaskLifecycle from '../hooks/useTaskLifecycle'

function Cemetery() {
	const {
		archivedTasks,
		activeCount,
		archiveCount,
		isLoading,
		error,
		isTaskProcessing,
		restoreTask,
		deleteTaskForever,
	} = useTaskLifecycle()

	return (
		<main className="app-shell">
			<section className="hero">
				<div className="hero__copy">
					<p className="section-label">Zona de descanso</p>
					<h1>Borradores de tareas</h1>
					<p className="hero__description">
						Aqui viven temporalmente las tareas completadas. Si no se restauran, se eliminan
						automaticamente de la base de datos al cumplir 15 minutos.
					</p>

					<div className="hero__stats">
						<article>
							<strong>{archiveCount}</strong>
							<span>Borradores</span>
						</article>
						<article>
							<strong>{activeCount}</strong>
							<span>Activas</span>
						</article>
						<article>
							<strong>15m</strong>
							<span>Auto-borrado</span>
						</article>
					</div>
				</div>

				<div className="hero__panel">
					<p className="section-label">Regla automatica</p>
					<ul className="module-list">
						<li>
							<strong>Restaurar</strong>
							<span>Recupera la tarea y la saca del cementerio.</span>
						</li>
						<li>
							<strong>Eliminar ahora</strong>
							<span>Borra la tarea manualmente antes de que expire.</span>
						</li>
						<li>
							<strong>Auto-borrado</strong>
							<span>El sistema la limpia cuando vence el tiempo.</span>
						</li>
					</ul>
				</div>
			</section>

			<section className="workspace-grid">
				<div className="panel panel--list">
					<div className="panel__header">
						<p className="section-label">Cementerio</p>
						<h2>Ultimas tareas completadas</h2>
					</div>

					{error ? <p className="field-error">{error}</p> : null}
					{isLoading ? <p>Cargando cementerio...</p> : null}

					{isLoading ? null : (
						<TaskArchiveList
							tasks={archivedTasks}
							onRestore={restoreTask}
							onDelete={deleteTaskForever}
							isTaskProcessing={isTaskProcessing}
						/>
					)}
				</div>
			</section>
		</main>
	)
}

export default Cemetery