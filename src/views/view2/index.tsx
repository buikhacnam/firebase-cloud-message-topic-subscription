import { Button, message } from 'antd'
import React, { useState } from 'react'
import { sendNotiToAllUsers } from '../../api'
import { getToken, onMessageListener } from '../../firebaseInit'

interface viewProps {}

const View: React.FC<viewProps> = ({}) => {
	const [isTokenFound, setTokenFound] = React.useState(false)
	const [show, setShow] = React.useState(false)
	const [notification, setNotification] = React.useState({
		title: '',
		body: '',
	})
	const [loading, setLoading] = useState(false)
	const [payload, setPayload] = useState(null)
	// console.log("Token found", isTokenFound);

	React.useEffect(() => {
		let data

		async function tokenFunc() {
			data = await getToken(setTokenFound)
			console.log('data', data)
			if (data) {
				console.log('Token is', data)
			}
			return data
		}

		tokenFunc()
	}, [setTokenFound])

	onMessageListener()
		.then(payload => {
			setShow(true)
			setNotification({
				title: payload.notification.title,
				body: payload.notification.body,
			})
			console.log(JSON.stringify(payload))
			setPayload(payload)
			message.success(payload.notification.body)
		})
		.catch(err => console.log('failed: ', err))
	
		const sendNotiToAll = async() => {
			setLoading(true)
			const res = await sendNotiToAllUsers()
			// window.open("/wait", "_blank")
			setLoading(false)

		}

	return (
		<div style={{maxWidth: 400, margin: '20px auto'}}>
			<h1>Firebase - Cloud Messaging</h1>

			<Button
				size='large'
				onClick={() => {sendNotiToAll()}}
				disabled={loading}
				loading={loading}
				
			>Send Notifications to all user</Button>
			<br/>
			<br />
			
			{payload && JSON.stringify(payload , null, 4)}
		</div>
	)
}
export default View
