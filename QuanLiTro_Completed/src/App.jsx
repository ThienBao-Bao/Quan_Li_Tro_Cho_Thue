import { useState } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import SubNavbar from './components/SubNavbar';
import RoomSale from './components/RoomSale';
import GuestVisit from './components/GuestVisit';
import AddGuestModal from './components/AddGuestModal';

import { mockUsers } from './data/users';
import { roomsData } from './data/rooms';
import { guestsData } from './data/guests';

import { authenticate } from './logic/auth';
import './App.css';

const PUBLIC_PAGE = 'room-sale';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(PUBLIC_PAGE);
  const [pendingPage, setPendingPage] = useState(null);
  const [guests, setGuests] = useState(guestsData);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [selectedRoomForGuest, setSelectedRoomForGuest] = useState(null);

  const [addGuestKey, setAddGuestKey] = useState(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const goToLogin = (intendedPage = null) => {
    setPendingPage(intendedPage);
    setLoginError('');
    setCurrentPage('login');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = authenticate(username, password, mockUsers);
    if (result.success) {
      setLoginError('');
      setIsAuthenticated(true);
      setCurrentPage(pendingPage || result.page);
      setPendingPage(null);
    } else {
      setLoginError(result.error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    setIsAddGuestOpen(false);
    setCurrentPage(PUBLIC_PAGE);
  };

  const handleNavigate = (page) => {
    if (page === 'guest-visit' && !isAuthenticated) {
      goToLogin('guest-visit');
      return;
    }
    setCurrentPage(page);
  };

  const handleOpenAddGuest = (room = null) => {
    if (!isAuthenticated) {
      goToLogin(PUBLIC_PAGE);
      return;
    }
    setSelectedRoomForGuest(room);
    setIsAddGuestOpen(true);
    setAddGuestKey((k) => k + 1);
  };

  const handleAddGuestSubmit = (newGuest) => {
    setGuests([newGuest, ...guests]);
    setCurrentPage('guest-visit');
  };

  return (
    <div className="App">
      <Header
        isAuthenticated={isAuthenticated}
        isLoginPage={currentPage === 'login'}
        onLogin={() => goToLogin(null)}
        onLogout={handleLogout}
        onBrowse={() => setCurrentPage(PUBLIC_PAGE)}
      />

      {currentPage === 'login' ? (
        <Login
          username={username}
          password={password}
          loginError={loginError}
          setUsername={setUsername}
          setPassword={setPassword}
          onSubmit={handleLoginSubmit}
        />
      ) : (
        <>
          <SubNavbar onNavigate={handleNavigate} />

          {currentPage === 'room-sale' && (
            <RoomSale rooms={roomsData} onOpenAddGuest={handleOpenAddGuest} />
          )}

          {currentPage === 'guest-visit' && isAuthenticated && (
            <GuestVisit guests={guests} onOpenAddGuest={handleOpenAddGuest} />
          )}

          <AddGuestModal
            key={addGuestKey}
            isOpen={isAddGuestOpen}
            onClose={() => setIsAddGuestOpen(false)}
            onSubmit={handleAddGuestSubmit}
            initialRoomData={selectedRoomForGuest}
          />
        </>
      )}
    </div>
  );
}

export default App;
