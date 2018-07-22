import ServiceCall from './ServiceCall';

export function getContacts() {
	const service  = new ServiceCall();

	return service.makeCall();
}

export function createContact(payload) {
	const method  = 'POST';
	const service  = new ServiceCall(method);

	debugger;

	return service.makeCall(payload);
}

export function getContactFromId(id) {
	const service  = new ServiceCall();

	service.URI = `/${id}`;

	return service.makeCall();
}

export function deleteContact(id) {
	const method  = 'DELETE';
	const service  = new ServiceCall(method);

	service.URI = `/${id}`;

	return service.makeCall();
}

export function updateContact(id, payload) {
	const method  = 'POST';
	const service  = new ServiceCall(method);

	service.URI = `/${id}`;

	return service.makeCall(payload);
}