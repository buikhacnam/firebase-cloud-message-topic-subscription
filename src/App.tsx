import React, {useEffect, lazy, Suspense } from 'react'
import { StyleSheetManager, ThemeProvider } from 'styled-components'
import theme, { GlobalStyle } from './styled/theme'
import { Route, Routes, Navigate } from 'react-router-dom'
import decode from 'jwt-decode'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Spin } from 'antd'
const Components: TODO = {
	LazyView2: lazy(() => import('./views/view2')),
	LazyLoginView: lazy(() => import('./views/auth/Login4')),
	LazyWait: lazy(() => import('./views/wait')),
}

const checkAuth = () => {
	const token = Cookies.get('fcm-access')
	const refreshToken = Cookies.get('fcm-refresh')
	const userName = Cookies.get('fcm-user')
	if (!token || !refreshToken) {
		return false
	}
	try {
		const decodeToken: any = decode(token)
		const refreshDecodeToken: any = decode(refreshToken)
		const now = new Date().getTime()

		if (now > refreshDecodeToken.exp * 1000) {
			return false
		}

		// refresh token api doesnt work, use this for now
		if (now > decodeToken.exp * 1000) {
			localStorage.removeItem('userName')
			localStorage.removeItem('userRole')
			axios({
				method: 'get',
				url:
					`${process.env.REACT_APP_BACKEND_URL}/api/security/user/token/refresh?userName=${userName}&refreshToken=${refreshToken}`,
				headers: {
					Authorization:
						`Bearer ${token}`,
				},
			})
				.then(function (response) {
					console.log('res below')
					console.log(JSON.stringify(response.data))
				})
				.catch(function (error) {
					console.log('err below')
					console.log(error.response.data.message)
				})

				return false
		}
	} catch (e) {
		return false
	}

	return true
}

// INCASE YOU DONT WANT TO MESS AROUND WITH CHECKING AUTH
const checkAuth2 = () => {return true}

// might need different types of loading later.
const skeletonMap: TODO = {
	LazyDashboard: <div>Loading...</div>,
	LazyView2: <div>Loading...</div>,
	LazyLoginView: <div>Loading...</div>,
}

const LazyComponent = ({ component, ...props }: TODO) => {
	// const isAuthenticated = checkAuth()
	const isAuthenticated = checkAuth()
	const View = Components?.[component] || Components['LazyDashboard']
	return (
		<Suspense
			// fallback={skeletonMap[component]}
			fallback={<div>Loading...</div>}
		>
			{isAuthenticated || component === 'LazyLoginView' ? (
				<View {...props} />
			) : (
				<Navigate to='/login' replace />
			)}
		</Suspense>
	)
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
	const handler = (e: any) => {
        e.preventDefault()
        localStorage.removeItem('currentPageLead')
		localStorage.removeItem('pageSizeLead')
        e.returnValue = false
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
	return (
		<div>
			<StyleSheetManager disableVendorPrefixes>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<Routes>
						{/* <Route
							path='/dashboard'
							element={<LazyComponent component={'LazyDashboard'} />}
						/> */}
					
						<Route
							path='/login'
							element={
								<LazyComponent component={'LazyLoginView'} />
							}
						/>
							<Route
							path='/wait'
							element={
								<LazyComponent component={'LazyWait'} />
							}
						/>
						<Route
							path='/*'
							element={
								<LazyComponent component={'LazyView2'} />
							}
						/>
					</Routes>
				</ThemeProvider>
			</StyleSheetManager>
		</div>
	)
}

export default App
