import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import useTaskLifecycle from '../hooks/useTaskLifecycle'

const MODULE_CARDS = [
	{
		title: 'API',
		description: 'Concentrará la comunicación con el backend desplegado.',
	},
	{
		title: 'Hooks',
		description: 'Administrarán estado, acciones y flujo de datos.',
	},
	{
		title: 'Componentes',
		description: 'Separarán la interfaz en piezas reutilizables.',
	},
	{
		title: 'Páginas',
		description: 'Orquestarán la composición de la vista principal.',
	},
]

function Home() {
	const {
		activeTasks,
		archiveCount,
		totalCount,
		isLoading,
		isSubmitting,
		error,
		isTaskProcessing,
		addTask,
		markTaskAsCompleted,
		updateTask,
		removeTask,
	} = useTaskLifecycle()

	return (
		<main className="app-shell">
			<section className="hero">
				<div className="hero__copy">
					<p className="section-label">Paso 1 de 5</p>
					<h1>Base modular lista para crecer</h1>
					<p className="hero__description">
						El frontend ya quedó dividido por responsabilidades para que luego podamos
						conectar el backend sin mezclar lógica, UI y estado.
					</p>

					<div className="hero__stats">
						<article>
							<strong>{activeTasks.length}</strong>
							<span>Activas</span>
						</article>
						<article>
							<strong>{archiveCount}</strong>
							<span>En cementerio</span>
						</article>
						<article>
							<strong>{totalCount}</strong>
							<span>Total</span>
						</article>
					</div>
				</div>

				<div className="hero__panel">
					<p className="section-label">Estructura</p>
					<ul className="module-list">
						{MODULE_CARDS.map((moduleCard) => (
							<li key={moduleCard.title}>
								<strong>{moduleCard.title}</strong>
								<span>{moduleCard.description}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="workspace-grid">
				<div className="panel panel--form">
					<TaskForm onSubmit={addTask} isSubmitting={isSubmitting} />
				</div>

				<div className="panel panel--list">
					<div className="panel__header">
						<p className="section-label">Tareas</p>
						<h2>Lógica conectada al backend</h2>
					</div>

					{error ? <p className="field-error">{error}</p> : null}
					{isLoading ? <p>Cargando tareas...</p> : null}

					{isLoading ? null : (
						<TaskList
							tasks={activeTasks}
							onComplete={markTaskAsCompleted}
							onDelete={removeTask}
							onUpdate={updateTask}
							isTaskProcessing={isTaskProcessing}
						/>
					)}
				</div>
			</section>
		</main>
	)
}

export default Home
