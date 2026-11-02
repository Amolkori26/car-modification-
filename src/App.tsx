/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Visualizer } from './components/Visualizer';
import { BeforeAfter } from './components/BeforeAfter';
import { PartsDatabase } from './components/PartsDatabase';
import { UserGallery } from './components/UserGallery';
import { Services } from './components/Services';
import { BookingForm } from './components/BookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Booking, BookingConfig, PartItem } from './types';
import { Activity } from 'lucide-react';

export default function App() {
  // Shared Root State for Bookings (State Lifting as specified in project report)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Cross-component coordination states:
  // Pre-filling booking form from visualizer
  const [bookingPrefillConfig, setBookingPrefillConfig] = useState<BookingConfig | null>(null);
  const [bookingPrefillVehicle, setBookingPrefillVehicle] = useState<string>('Nissan GT-R R35 Nismo');
  const [bookingPrefillPrice, setBookingPrefillPrice] = useState<number>(14500);

  // Gallery publish modal trigger from visualizer
  const [galleryPublishConfig, setGalleryPublishConfig] = useState<BookingConfig | null>(null);
  const [galleryPublishVehicle, setGalleryPublishVehicle] = useState<string>('');
  const [isGalleryPublishOpen, setIsGalleryPublishOpen] = useState(false);

  // Initial fetch of shared booking records
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

    // Smooth scroll to booking form
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When user clicks "Publish To User Gallery" in visualizer
  const handleOpenGalleryPublish = (config: BookingConfig, vehicleName: string) => {
    setGalleryPublishConfig(config);
    setGalleryPublishVehicle(vehicleName);
    setIsGalleryPublishOpen(true);

    const galleryEl = document.getElementById('gallery');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When user clicks "Configure in Workshop" on a parts catalog item
  const handleSelectPartForBuild = (part: PartItem) => {
    const customizerEl = document.getElementById('customizer');
    if (customizerEl) {
      customizerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Navbar activeBookingsCount={bookings.length} />

      {/* Main Experience Flows */}
      <main className="flex-1">
        {/* 1. Hero & Value Proposition */}
        <Hero />

        {/* 2. Interactive 2D Vehicle Customizer with Web Audio Engine Synth */}
        <Visualizer
          onSelectForBooking={handleSelectForBooking}
          onOpenGalleryPublish={handleOpenGalleryPublish}
        />

        {/* 3. Touch-Enabled Before / After Telemetry Split Slider */}
        <BeforeAfter />

        {/* 4. Complete Parts Database & Stock Catalog */}
        <PartsDatabase onSelectPartForBuild={handleSelectPartForBuild} />

        {/* 5. Custom Project Galleries for Users with Likes & Publishing */}
        <UserGallery
          initialConfigToPublish={galleryPublishConfig}
          initialVehicleName={galleryPublishVehicle}
          isPublishModalOpen={isGalleryPublishOpen}
          onClosePublishModal={() => setIsGalleryPublishOpen(false)}
        />

        {/* 6. Precision Engineering Workshop Services */}
        <Services />

        {/* 7. Three-Step Customer Booking & Bay Scheduling Form */}
        <BookingForm
          initialConfig={bookingPrefillConfig}
          initialVehicle={bookingPrefillVehicle}
          initialPrice={bookingPrefillPrice}
          onBookingCreated={handleAddBooking}
        />

        {/* 8. Operational Command Dashboard (Bay allocation, queue triage, inventory reorder) */}
        <AdminDashboard
          bookings={bookings}
          onUpdateBooking={handleUpdateBooking}
        />
      </main>

      {/* Persistent Floating Quick Action Button: Open Dashboard */}
      <a
        href="#admin-portal"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-cyan-400/60 text-cyan-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-xl transition-all hover:scale-105 group cursor-pointer"
        aria-label="Open Command Dashboard"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
        </span>
        <Activity className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Open Dashboard</span>
        <span className="sm:hidden">Dashboard</span>
        {bookings.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-lime-400 text-neutral-950 text-[10px] font-bold">
            {bookings.length}
          </span>
        )}
      </a>

      {/* Footer with Capstone Attributions to Amol Kori */}
      <Footer />
    </div>
  );
}
