import { NavLink, Outlet } from 'react-router-dom'

function AppLayout() {
	return (
		<div className="app-frame">
			<header className="app-topbar">
				<div className="app-brand">
					<span className="app-brand__eyebrow">Task Board</span>
					<strong className="app-brand__title">Lista de tareas modular</strong>
					<span className="app-brand__subtitle">Borradores automaticos en 15 minutos</span>
				</div>

				<nav className="app-nav" aria-label="Navegacion principal">
					<NavLink to="/" end>
						Activas
					</NavLink>
					<NavLink to="/borradores">
						Borradores
					</NavLink>
				</nav>
			</header>

			<Outlet />
		</div>
	)
}

export default AppLayout