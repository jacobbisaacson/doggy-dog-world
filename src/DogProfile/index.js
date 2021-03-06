import React, { useState, useEffect } from 'react'
import AddDogForm from '../AddDogForm'
import DogList from '../DogList'
import EditDogModal from '../EditDogModal'
// import { Form, Button, Label, Segment } from 'semantic-ui-react'

export default function DogProfile() {
  const [dogs, setDogs] = useState([])
  const [idOfDogToEdit, setIdOfDogToEdit] = useState(-1)

  useEffect(() => {
    getDogs()
  }, [])

  const getDogs = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "/api/v1/dogs/"
      const dogsResponse = await fetch(url, {
        credentials: 'include'
      })
      const dogsJson = await dogsResponse.json()
      setDogs(dogsJson.data)
    } catch(err) {
      console.error("Error getting dog data.", err)
    }
  }

  const deleteDog = async (idOfDogToDelete) => {
    const url = process.env.REACT_APP_API_URL + "/api/v1/dogs/" + idOfDogToDelete
    try {
      const deleteDogResponse = await fetch(url, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteDogResponse.status === 200) {
        setDogs(dogs.filter(dog => dog.id !== idOfDogToDelete))
      }
    } catch(err) {
      console.error("Error deleting dog:");
      console.error(err);
    }
  }

  const createDog = async (dogToAdd) => {
    try {
      const url = process.env.REACT_APP_API_URL + "/api/v1/dogs/"
      const createDogResponse = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dogToAdd)
      })
      const createDogJson = await createDogResponse.json()
      if(createDogResponse.status === 201) {
        setDogs([...dogs, createDogJson.data])
      }
    } catch(err) {
      console.error("Error adding DOGGY")
      console.error(err)
    }

  }

  const editDog = (idOfDogToEdit) => setIdOfDogToEdit(idOfDogToEdit)

  const updateDog = async (updatedDogInfo) => {
    const url = process.env.REACT_APP_API_URL + "/api/v1/dogs/" + idOfDogToEdit
    try {
      const updateDogResponse = await fetch(url, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(updatedDogInfo), 
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const updateDogJson = await updateDogResponse.json()
      if(updateDogResponse.status === 200) {
        const indexOfDogBeingUpdated = dogs.findIndex(dog => dog.id === idOfDogToEdit)
        dogs[indexOfDogBeingUpdated] = updateDogJson.data
        setDogs(dogs)
        setIdOfDogToEdit(-1)
      }
    } catch(err) {
      console.error("Error updating dog info")
      console.error(err)
    }

  }

  const closeModal = () => setIdOfDogToEdit(-1)
  
  return(
    <React.Fragment>
        <DogList 
          dogs={dogs}
          deleteDog={deleteDog}
          editDog={editDog}
        />
        {
          idOfDogToEdit !== -1
          &&
          <EditDogModal
            key={idOfDogToEdit} 
            dogToEdit={dogs.find((dog) => dog.id === idOfDogToEdit)}
            updateDog={updateDog}
            closeModal={closeModal}
          />
        }
        <AddDogForm createDog={createDog} />
    </React.Fragment>
  )
}

// in here conditinal logic for displaying either the add Dog form or the edit dog modal



