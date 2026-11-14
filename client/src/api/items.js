import { request, downloadBlob } from './client.js'

export function listItems(parentId) {
    const query = parentId ? `user=${encodeURIComponent(parentId)}` : '';
    return request(`/api/items${query}`);
}

export function createFolder(name, parentId) {
    return request('/api/items', { method: 'POST', json: { name, user: parentId} });
}

export function updateItem(id, changes) {
    return request(`/api/items/${id}`, { method: 'PATCH', json: changes });
}

export function deleteItem(id) {
    return request(`/api/${id}`, { method: 'DELETE' });
}

export function uploadFile(file, parentId) {
    const form = new FormData();
    if (parentId) {
        form.append("item", parentId);
    }
    form.append('photo', file);
    return request('/api/items/photo', { method: 'POST', body: form });
}

export function downloadItem(item) {
    return downloadBlob(`/api/items/${item.id}/receipt`, `receipt-${item.number}.pdf`);
}