import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Cemetery from '../pages/Cemetery'
import Home from '../pages/Home'

function AppRoutes() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<Home />} />
				<Route path="cementerio" element={<Cemetery />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	)
}

export default AppRoutes