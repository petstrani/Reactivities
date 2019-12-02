import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;

}

// activity:initialFormState - na ta način activity preimenujemo v drug naziv, 
const ActivityForm: React.FC<IProps> = ({ setEditMode, activity: initialFormState, createActivity, editActivity,submitting}) => {
    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        } else {
            // id tu ne rabimo, a ga določimo, ker nam TS drugače javi napako zaradi Interface-a
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''

            }
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    // tole je za to, da se spremembe na vnosni maski zabeležijo v state
    //setActivity({...activity, title: event.target.value}) // spodaj je bolj splošna rešitev 
    //setActivity({...activity, [event.target.name]: event.target.value})
    const handleSubmit = () => {
        //console.log(activity);
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // tole je pa splošna rešitev, ki deluje za vsa polja - morajo imeti atribut name
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title' onChange={handleInputChange} name='title' value={activity.title} />
                <Form.TextArea rows={2} placeholder='Description' onChange={handleInputChange} name='description' value={activity.description} />
                <Form.Input placeholder='Category' onChange={handleInputChange} name='category' value={activity.category} />
                <Form.Input
                    type='datetime-local'
                    placeholder='Date'
                    onChange={handleInputChange}
                    name='date'
                    value={activity.date} />
                <Form.Input placeholder='City' onChange={handleInputChange} name='city' value={activity.city} />
                <Form.Input placeholder='Venue' onChange={handleInputChange} name='venue' value={activity.venue} />

                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />

            </Form>
        </Segment>
    )
}

export default ActivityForm;