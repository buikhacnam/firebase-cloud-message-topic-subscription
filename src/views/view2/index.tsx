import { Button, Divider, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchUsers, sendNotiToAllUsers, sendNotiToAUser } from '../../api'
import { getToken, onMessageListener } from '../../firebaseInit'
import Cookie from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import { Icon } from '@iconify/react';


interface viewProps {}

message.config({})

const View: React.FC<viewProps> = ({}) => {
	const navigate = useNavigate()
	const [isTokenFound, setTokenFound] = useState(false)

	const [loading, setLoading] = useState(false)
	const [payload, setPayload] = useState<any>(null)

	const [loadingInd, setLoadingInd] = useState(false)
	const [payloadInd, setPayloadInd] = useState<any>(null)

	const [user, setUser] = useState([])
	const [searchUser, setSearchUser] = useState(null)

	console.log('serach user', searchUser)
	useEffect(() => {
		let data

		async function tokenFunc() {
			data = await getToken(setTokenFound)
			if (data) {
				console.log('Token is', data)
			}
			return data
		}

		tokenFunc()
	}, [setTokenFound])

	useEffect(() => {
		fetchUser()
	}, [searchUser])

	const fetchUser = async () => {
		const r = await fetchUsers(searchUser || '')
		console.log('r user', r)
		setUser(r.data?.responseData)
	}

	onMessageListener()
		.then(payload => {
			console.log(payload)
			setPayload(payload)
			message.success(payload.notification.body)
		})
		.catch(err => console.log('failed: ', err))

	const sendNotiToAll = async () => {
		setLoading(true)
		setPayload('Sending notification...')
		await sendNotiToAllUsers()
		setLoading(false)
	}

	const sendNotiToUser = async () => {
		setLoadingInd(true)
		setPayloadInd('Sending notification...')
		setPayload(null)
		const res = await sendNotiToAUser(searchUser|| '')
		console.log('res', res)
		setPayloadInd(res.data)
		setLoadingInd(false)
	}

	const logoutUser = () => {
        Cookie.remove('fcm-refresh')
        Cookie.remove('fcm-access')
        Cookie.remove('fcm-user')
        message.success('You have been logged out')
        navigate('/login')
    }

	return (
		<div style={{textAlign: 'center', height: '90vh', overflow: 'hidden'}}>
			<div
				style={{
					maxWidth: 450,
					margin: '20px auto',
					textAlign: 'center',
					height: '90%' 
				}}
			>
				<h1><Icon icon="simple-icons:firebase" /> Firebase - Cloud Messaging</h1>
				<h3>Welcome! <span>{localStorage.getItem('userName')}</span> | <a onClick={() => logoutUser()}>Logout</a></h3>

				<Button
					size='large'
					onClick={() => {
						sendNotiToAll()
					}}
					disabled={loading}
					loading={loading}
					danger
					type='primary'
				>
					Send a Notification to all users
				</Button>
				<br />
				<br />
				{payload && <div>{JSON.stringify(payload, null, 4)}</div>}

				<Divider />

				<Select
					onClear={() => {}}
					onChange={v => {
						console.log(v)
						setSearchUser(v)
					}}
					allowClear
					value={searchUser}
					showSearch
					placeholder='search a specific user to send notification'
					onSearch={(e: any) => setSearchUser(e)}
					style={{ marginTop: 10, width: '100%' }}
					showArrow={false}
					size='large'
				>
					{user.map((item: any) => {
						return (
							<Select.Option key={item.id} value={item.userName}>
								<span>{item.userName}</span>
							</Select.Option>
						)
					})}
				</Select>

				<Button
					style={{ marginTop: 10, marginBottom: 20 }}
					size='large'
					type='primary'
					onClick={() => {
						sendNotiToUser()
					}}
					disabled={loadingInd || !searchUser}
					loading={loadingInd}
				>
					<span>Send a Notification to</span>{' '}
					<span style={{ color: 'yellow', marginLeft: 5 }}>
						{searchUser || '...'}
					</span>
				</Button>
				{payloadInd && <div>{JSON.stringify(payloadInd, null, 4)}</div>}
				<p style={{marginTop: 30, fontStyle: 'italic', fontSize: '0.8rem'}}>Tips:</p>
					<span style={{fontStyle: 'italic', fontSize: '0.8rem'}}>#1 You can log in to other devices / accounts to test it more</span><br></br>
					<span style={{fontStyle: 'italic', fontSize: '0.8rem'}}>#2 You may want to allow getting notifications from browser / this website</span>
			</div>

		
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<span style={{ fontSize: '0.8rem' }}>
					Created by{' '}
					<a href='https://github.com/buikhacnam' target={'_blank'}>
						Bui Nam
					</a>{' '}
					with ❤️
				</span>
			</div>
		</div>
	)
}
export default View
