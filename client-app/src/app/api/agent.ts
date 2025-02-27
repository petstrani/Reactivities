import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';

axios.defaults.baseURL='http://localhost:5000/api'; // privzeti naslov

const responseBody = (response: AxiosResponse) => response.data;

// ukaz, s katerim upočasnimo izvajanje ukazov
const sleep = (ms: number) => (response: AxiosResponse) => 
new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response),ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url,body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

// spodaj Promise<IActivity[]> določa tip rezultata funkcije list
const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get('/activities/${id}'),
    create: (activity: IActivity) => requests.post('/activities',activity),
    update: (activity: IActivity) => requests.put('/activities/'+activity.id,activity),
    delete: (id: string) => requests.del('/activities/'+id)


}

export default {
    Activities
}