import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
//import Activities from '../api/agent'
import agent from '../api/agent';
import { LoadingComponent } from './LoadingComponent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);  // za prikaz obvestila, da se vsebina loada
  const [submitting, setSubmitting] = useState(false);  // za prikaz obvestila, ko shranjujemo podatke
  const [target,setTarget] = useState(''); // trget predstavlja button, ki ga kliknemo

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0])
    setEditMode(false);
  }

  // za dodajanje novega activity
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  // tole je za kreiranje zapisa
  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity); // selektira na novo ustvarjen zapis
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }
  // spodnji ukaz je za update - s 'filter' selektiramo v arrayu vse zapise, razen tistega, ki ga spreminjamo
  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id != activity.id), activity]);
      setSelectedActivity(activity); // selektira na novo ustvarjen zapis
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }
  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id != id)]);
      //setSelectedActivity(activity); // selektira na novo ustvarjen zapis
      //setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })

        setActivities(activities);
      }).then(() => setLoading(false));
  }, []);  // če z drugim parametrom podamo prazen array, se ta metoda kliče le enkrat, drugače ob vsakem refreshu vsebine

  // spodaj klicaj določa, da je lahko vrednost tudi null
  if (loading) return <LoadingComponent content='Loading activities...' />

  return (
    <div>
      <NavBar openCreateForm={handleOpenCreateForm}></NavBar>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities} selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </div>
  );
}
export default App;


