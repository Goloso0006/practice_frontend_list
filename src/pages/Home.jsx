import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import useTasks from '../hooks/useTasks'

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
		tasks,
		completedTasks,
		pendingTasks,
		addTask,
		toggleTaskCompletion,
		removeTask,
	} = useTasks()

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
							<strong>{tasks.length}</strong>
							<span>Tareas visibles</span>
						</article>
						<article>
							<strong>{completedTasks}</strong>
							<span>Completadas</span>
						</article>
						<article>
							<strong>{pendingTasks}</strong>
							<span>Pendientes</span>
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
					<TaskForm onSubmit={addTask} />
				</div>

				<div className="panel panel--list">
					<div className="panel__header">
						<p className="section-label">Tareas</p>
						<h2>Estado local preparado para pasar a API</h2>
					</div>

					<TaskList
						tasks={tasks}
						onToggleCompletion={toggleTaskCompletion}
						onDelete={removeTask}
					/>
				</div>
			</section>
		</main>
	)
}

export default Home
