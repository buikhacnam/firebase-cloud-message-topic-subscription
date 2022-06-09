import firebase from 'firebase/app'
import 'firebase/messaging'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyA95acUPHRfC4boDHxJodTo-HUXZ6iDNns',
	authDomain: 'test-noti-124ba.firebaseapp.com',
	projectId: 'test-noti-124ba',
	storageBucket: 'test-noti-124ba.appspot.com',
	messagingSenderId: '550678738010',
	appId: '1:550678738010:web:36e8e79a16ed73beeb1463',
	measurementId: 'G-QZ8T7Z3ZM7',
}
firebase.initializeApp(firebaseConfig)

export const messaging = firebase.messaging()

export const getToken = async setTokenFound => {
	let currentToken = ''

	try {
		currentToken = await messaging.getToken({
			vapidKey: 'BC6S7PA4oA-Yc34-b6RqyVkIRpx975q_6UxSg8_b21EVC5JdjaFfOGTNLevn6hsQidbUb3Cp0CyLGRekELifBm0',
		})
		if (currentToken) {
			setTokenFound(true)
		} else {
			setTokenFound(false)
		}
	} catch (error) {
		console.log('An error occurred while retrieving token. ', error)
	}

	return currentToken
}

export const onMessageListener = () =>
	new Promise(resolve => {
		console.log('run on message in firebase init')
		messaging.onMessage(payload => {
			resolve(payload)
		})
	})
