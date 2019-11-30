import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, Icon, List, Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editMode, setEditMode] = useState(false);

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
    setActivities([...activities, activity]);
    setSelectedActivity(activity); // selektira na novo ustvarjen zapis
    setEditMode(false);
  }
  // spodnji ukaz je za update - s 'filter' selektiramo v arrayu vse zapise, razen tistega, ki ga spreminjamo
  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a=> a.id!=activity.id), activity]);
    setSelectedActivity(activity); // selektira na novo ustvarjen zapis
    setEditMode(false);
  }
  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a=> a.id!=id)]);
    //setSelectedActivity(activity); // selektira na novo ustvarjen zapis
    //setEditMode(false);
  }

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities').then((response) => {
      //setActivities(response.data); // ta ukaz je dovolj, če ne spreminjamo podatkov rezultata

      // primer, ko spremenimo podatke o datmu in času
      let activities: IActivity[] = [];
      response.data.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      })

      setActivities(response.data);
    });
  }, []);  // če z drugim parametrom podamo prazen array, se ta metoda kliče le enkrat, drugače ob vsakem refreshu vsebine

  // spodaj klicaj določa, da je lahko vrednost tudi null
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
        />
      </Container>
    </div>
  );
}
export default App;
