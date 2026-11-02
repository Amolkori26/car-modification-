/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { Visualizer } from './components/Visualizer';
import { BeforeAfter } from './components/BeforeAfter';
import { PartsDatabase } from './components/PartsDatabase';
import { UserGallery } from './components/UserGallery';
import { Services } from './components/Services';
import { BookingForm } from './components/BookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AppPage, Booking, BookingConfig, PartItem, UserSession } from './types';

export default function App() {
  // Authentication Gateway State (Gates website entrance before opening)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('vertex_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.avatar = '';
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Dedicated Page Routing State (Defaults to 'home')
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  // Shared Root State for Bookings (State Lifting as specified in capstone report)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Cross-page coordination states:
  // Pre-filling booking form from customizer
  const [bookingPrefillConfig, setBookingPrefillConfig] = useState<BookingConfig | null>(null);
  const [bookingPrefillVehicle, setBookingPrefillVehicle] = useState<string>('Nissan GT-R R35 Nismo');
  const [bookingPrefillPrice, setBookingPrefillPrice] = useState<number>(14500);

  // Gallery publish modal trigger from customizer
  const [galleryPublishConfig, setGalleryPublishConfig] = useState<BookingConfig | null>(null);
  const [galleryPublishVehicle, setGalleryPublishVehicle] = useState<string>('');
  const [isGalleryPublishOpen, setIsGalleryPublishOpen] = useState(false);

  // Initial fetch of shared booking records from backend
  useEffect(() => {
    const fetchInitialBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error('Failed to load shared bookings from API:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchInitialBookings();
  }, []);

  // Authentication Handlers
  const handleLogin = (session: UserSession) => {
    setCurrentUser(session);
    try {
      localStorage.setItem('vertex_user_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Could not persist session to localStorage', e);
    }
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vertex_user_session');
    } catch (e) {
      console.warn('Could not clear session', e);
    }
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentUser?.role === 'admin';

  const handleNavigate = (page: AppPage) => {
    // Restrict Parts Database access to Admin login only
    if (page === 'parts' && currentUser?.role !== 'admin') {
      setCurrentPage('home');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback when customer submits 3-step booking form
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Callback when administrator updates status, bay assignment, or progress %
  const handleUpdateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  // When user clicks "Book Workshop Build With This Spec" in visualizer
  const handleSelectForBooking = (config: BookingConfig, vehicleName: string, calculatedPrice: number) => {
    setBookingPrefillConfig(config);
    setBookingPrefillVehicle(vehicleName);
    setBookingPrefillPrice(calculatedPrice);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user clicks "Publish To User Gallery" in visualizer
  const handleOpenGalleryPublish = (config: BookingConfig, vehicleName: string) => {
    setGalleryPublishConfig(config);
    setGalleryPublishVehicle(vehicleName);
    setIsGalleryPublishOpen(true);
    setCurrentPage('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user clicks "Configure in Workshop" on a parts catalog item
  const handleSelectPartForBuild = (part: PartItem) => {
    setCurrentPage('customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user selects a service package
  const handleSelectService = (serviceName: string) => {
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. GATEWAY: If not authenticated, render Login Page before entering website
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. MAIN APPLICATION: Authenticated Multi-Page Experience
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header - Integrated with Dashboard item in menu bar and active user info */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        activeBookingsCount={bookings.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Dedicated Page Viewport */}
      <main className="flex-1 pt-20">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            activeBookingsCount={bookings.length}
            isAdmin={isAdmin}
          />
        )}

        {currentPage === 'customizer' && (
          <div className="py-6">
            <Visualizer
              onSelectForBooking={handleSelectForBooking}
              onOpenGalleryPublish={handleOpenGalleryPublish}
            />
          </div>
        )}

        {currentPage === 'comparison' && (
          <div className="py-6">
            <BeforeAfter />
          </div>
        )}

        {currentPage === 'parts' && (
          isAdmin ? (
            <div className="py-6">
              <PartsDatabase
                onSelectPartForBuild={handleSelectPartForBuild}
                onNavigateToBooking={() => handleNavigate('booking')}
              />
            </div>
          ) : (
            <HomePage
              onNavigate={handleNavigate}
              activeBookingsCount={bookings.length}
              isAdmin={false}
            />
          )
        )}

        {currentPage === 'gallery' && (
          <div className="py-6">
            <UserGallery
              initialConfigToPublish={galleryPublishConfig}
              initialVehicleName={galleryPublishVehicle}
              isPublishModalOpen={isGalleryPublishOpen}
              onClosePublishModal={() => setIsGalleryPublishOpen(false)}
              onNavigateToCustomizer={() => handleNavigate('customizer')}
            />
          </div>
        )}

        {currentPage === 'services' && (
          <div className="py-6">
            <Services onSelectService={handleSelectService} />
          </div>
        )}

        {currentPage === 'booking' && (
          <div className="py-6">
            <BookingForm
              initialConfig={bookingPrefillConfig}
              initialVehicle={bookingPrefillVehicle}
              initialPrice={bookingPrefillPrice}
              onBookingCreated={handleAddBooking}
              onNavigateToDashboard={() => handleNavigate('dashboard')}
            />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="py-6">
            <AdminDashboard
              bookings={bookings}
              onUpdateBooking={handleUpdateBooking}
            />
          </div>
        )}
      </main>

      {/* Footer with Capstone Attributions */}
      <Footer onNavigate={handleNavigate} isAdmin={isAdmin} />
    </div>
  );
}
