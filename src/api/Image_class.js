import axios from '~/axios.js'

export function getImageClassList(page) {
     return axios.get('/admin/image_class/' + page)
}
export function CreateImageClass(data) {
     return axios.post('/admin/image_class', data)
}
export function UpdateImageClass(id, data) {
     return axios.post('/admin/image_class/' + id, data)
}
export function DeleteImageClass(id) {
     return axios.post(`/admin/image_class/${id}/delete`)
}    