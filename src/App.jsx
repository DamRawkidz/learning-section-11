import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const stodeIds = JSON?.parse(localStorage.getItem('selectedPlaces')) || []
const storedPlace = stodeIds.map(id => AVAILABLE_PLACES.find(place => place.id == id))
function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [pickedPlaces, setPickedPlaces] = useState(storedPlace);
  const [availablePlaces, setAvailablePlaces] = useState([])


  // useEffect(() => {
  //   const stodeIds = JSON?.parse(localStorage.getItem('selectedPlaces')) || []
  //   const storedPlace = stodeIds.map(id => AVAILABLE_PLACES.find(place => place.id == id))
  //   setPickedPlaces(storedPlace)
  // }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const data = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)
      setAvailablePlaces(data)
    })

  }, [])

  function handleStartRemovePlace(id) {
    setModalIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]))
    }

  }


  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false)

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    localStorage.setItem('selectedPlaces', JSON.stringify(storeIds.fitler(id => id !== selectedPlace.current)))
  }, [])



  return (
    <>
      <Modal ref={modal} open={modalIsOpen}>

        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />

      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={AVAILABLE_PLACES}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
