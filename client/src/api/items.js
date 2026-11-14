import { request, downloadBlob } from './client.js'

export function listItems(parentId) {
    const query = parentId ? `?parent=${encodeURIComponent(parentId)}` : '';
    return request(`/api/items${query}`);
}

export function createFolder(name, parentId) {
    return request('/api/items/folder', { method: 'POST', json: { name, parent: parentId} });
}

export function updateItem(id, changes) {
    return request(`/api/items/${id}`, { method: 'PATCH', json: changes });
}

export function deleteItem(id) {
    return request(`/api/items/${id}`, { method: 'DELETE' });
}

export function uploadFile(file, parentId) {
    const form = new FormData();
    if (parentId) {
        form.append("parent", parentId);
    }
    form.append('file', file);
    return request('/api/items/upload', { method: 'POST', body: form });
}

export function downloadItem(item) {
    return downloadBlob(`/api/items/${item.id}/download`, item.name);
}