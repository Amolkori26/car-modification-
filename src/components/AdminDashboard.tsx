import React, { useState, useEffect } from 'react';
import { Booking, InventoryItem, AuditLog } from '../types';
import { WORKSHOP_BAYS } from '../data/mockData';
import {
  ShieldAlert,
  Activity,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sliders,
  DollarSign,
  User,
  Car,
  FileText,
  Plus,
  RefreshCw,
  X,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onUpdateBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'bays' | 'inventory' | 'audit'>('queue');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedBookingForInspect, setSelectedBookingForInspect] = useState<Booking | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchInventory();
    fetchAuditLogs();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    onUpdateBooking(id, { status: newStatus });
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAuditLogs();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleBayChange = async (id: string, newBay: number | null) => {
    onUpdateBooking(id, { bay: newBay });
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bay: newBay }),
      });
      fetchAuditLogs();
    } catch (err) {
      console.error('Failed to update bay:', err);
    }
  };

  const handleProgressChange = async (id: string, newProgress: number) => {
    onUpdateBooking(id, { progress: newProgress });
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress }),
      });
      fetchAuditLogs();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleReorder = async (itemId: string) => {
    try {
      setReorderingId(itemId);
      const res = await fetch('/api/inventory/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, quantity: 5 }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, stock: data.data.stock } : item))
        );
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Reorder failed:', err);
    } finally {
      setReorderingId(null);
    }
  };

  // Metrics
  const totalBookingsCount = bookings.length;
  const activeBaysCount = bookings.filter((b) => b.bay !== null && b.status === 'In Progress').length;
  const pendingApprovalsCount = bookings.filter((b) => b.status === 'Pending').length;
  const totalWorkshopRevenue = bookings.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const lowStockCount = inventory.filter((i) => i.stock <= i.minStock).length;

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'All') return true;
    return b.status === filterStatus;
  });

  return (
    <section id="admin-portal" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            Operational Command Dashboard
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Vertex <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Workshop Terminal</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mt-1">
            Real-time bay telemetry, customer booking triage, progress sequencing, and inventory reorder controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchInventory();
              fetchAuditLogs();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* KPI Stats HUD Grid (Screenshot 7 from report) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-neutral-400">Total Bookings</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-white">
            {totalBookingsCount}
          </div>
          <span className="text-[10px] font-mono text-cyan-400 mt-1 block">Active across all stages</span>
        </div>

        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-neutral-400">Bay Occupancy</span>
            <Wrench className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-lime-400">
            {activeBaysCount} / 4 <span className="text-xs text-neutral-400 font-normal">Bays</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
            {Math.round((activeBaysCount / 4) * 100)}% workshop capacity
          </span>
        </div>

        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-neutral-400">Pending Triage</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-amber-400">
            {pendingApprovalsCount}
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-1 block">Awaiting bay approval</span>
        </div>

        <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-neutral-400">Workshop Revenue</span>
            <span className="font-bold font-mono text-emerald-400 text-base leading-none">₹</span>
          </div>
          <div className="text-2xl md:text-3xl font-black font-mono text-white">
            ₹{totalWorkshopRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Total booked value</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-4 mb-8 overflow-x-auto">
        {[
          { id: 'queue', label: `Shared Booking Queue (${bookings.length})` },
          { id: 'bays', label: `Workshop Bays Allocation (4 Bays)` },
          { id: 'inventory', label: `Inventory & Reorder (${lowStockCount > 0 ? `${lowStockCount} Low` : 'Optimal'})` },
          { id: 'audit', label: `Operational Audit Logs` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-800 text-lime-400 border border-lime-500/50 shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SHARED BOOKING QUEUE (Screenshot 7) */}
      {activeTab === 'queue' && (
        <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl overflow-hidden">
          {/* Status filter pills */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Filter Status:</span>
              {['All', 'Pending', 'Approved', 'In Progress', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filterStatus === st
                      ? 'bg-lime-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-neutral-400">
              Showing {filteredBookings.length} reservations
            </span>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 font-mono uppercase text-[10px] tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Ticket / Customer</th>
                  <th className="py-3 px-4">Machine & Spec</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Bay Assignment</th>
                  <th className="py-3 px-4">Progress (%)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-lime-400">{b.id}</div>
                      <div className="text-white font-sans font-medium">{b.name}</div>
                      <div className="text-[10px] text-neutral-500 font-sans">{b.phone}</div>
                    </td>

                    {/* Machine */}
                    <td className="py-4 px-4 font-sans">
                      <div className="font-bold text-neutral-200">{b.makeModel} ({b.year})</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                          style={{ backgroundColor: b.config?.paint || '#84cc16' }}
                        />
                        <span>{b.config?.paintName || 'Acid Lime'}</span>
                      </div>
                      <span className="text-[10px] text-lime-400 font-mono font-bold block mt-1">
                        ₹{b.price?.toLocaleString()}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-neutral-300">
                      {b.date}
                    </td>

                    {/* Workshop Bay */}
                    <td className="py-4 px-4">
                      <select
                        value={b.bay ?? ''}
                        onChange={(e) => handleBayChange(b.id, e.target.value ? Number(e.target.value) : null)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Unassigned</option>
                        <option value="1">Bay 1 (Dyno)</option>
                        <option value="2">Bay 2 (Paint)</option>
                        <option value="3">Bay 3 (Aero)</option>
                        <option value="4">Bay 4 (Electric)</option>
                      </select>
                    </td>

                    {/* Progress Slider */}
                    <td className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={b.progress}
                          onChange={(e) => handleProgressChange(b.id, Number(e.target.value))}
                          className="w-24 accent-lime-400 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-white min-w-[32px]">
                          {b.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-950 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-lime-400 h-1 rounded-full"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                    </td>

                    {/* Status Pill / Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase border focus:outline-none ${
                          b.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : b.status === 'In Progress'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : b.status === 'Approved'
                            ? 'bg-lime-500/20 text-lime-400 border-lime-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedBookingForInspect(b)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. WORKSHOP BAYS ALLOCATION (Screenshot 8) */}
      {activeTab === 'bays' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKSHOP_BAYS.map((bay) => {
              const activeBooking = bookings.find((b) => b.bay === bay.id && b.status !== 'Completed');
              return (
                <div
                  key={bay.id}
                  className={`rounded-3xl bg-neutral-900/90 border p-6 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                    activeBooking
                      ? 'border-lime-500/40 shadow-[0_0_20px_rgba(132,204,22,0.1)]'
                      : 'border-neutral-800 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase text-lime-400">
                        {bay.name.split(':')[0]}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          activeBooking
                            ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {activeBooking ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">
                      {bay.name.split(':')[1]}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-4">{bay.specialty}</p>

                    {/* Active Vehicle Info */}
                    {activeBooking ? (
                      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 mb-4">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">
                          Ticket: {activeBooking.id}
                        </span>
                        <div className="text-sm font-bold text-white mb-0.5">
                          {activeBooking.makeModel}
                        </div>
                        <div className="text-xs text-neutral-400 mb-3">
                          Client: {activeBooking.name}
                        </div>

                        {/* Progress */}
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-neutral-400">Bay Stage Progress:</span>
                          <span className="text-lime-400 font-bold">{activeBooking.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-lime-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${activeBooking.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center mb-4">
                        <Wrench className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
                        <span className="text-xs font-mono text-neutral-500 block">
                          Bay clean & ready for assignment
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">Lead Tech: {bay.tech}</span>
                    {activeBooking && (
                      <button
                        onClick={() => handleBayChange(activeBooking.id, null)}
                        className="text-neutral-400 hover:text-red-400 cursor-pointer"
                      >
                        Clear Bay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PARTS INVENTORY & REORDER SIMULATION (Screenshot 9 & Section 12) */}
      {activeTab === 'inventory' && (
        <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase">
                Hardware Stock & Restock Controls
              </h3>
              <p className="text-xs text-neutral-400">
                Automated threshold monitoring based on Section 12 Inventory Control Schema.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 text-neutral-400 text-[10px] uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Identifier / SKU</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Min. Threshold</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4 text-right">Reorder Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {inventory.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-neutral-800/30">
                      <td className="py-4 px-4 font-bold text-lime-400">
                        {item.id}
                        <div className="text-[10px] text-neutral-500 font-normal">{item.sku}</div>
                      </td>
                      <td className="py-4 px-4 font-sans font-medium text-white">
                        {item.name}
                        <div className="text-[10px] text-neutral-500 font-mono">Supplier: {item.supplier}</div>
                      </td>
                      <td className="py-4 px-4 text-neutral-300">
                        {item.category}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${isLow ? 'text-rose-400' : 'text-neutral-100'}`}>
                          {item.stock} {item.unit}
                        </span>
                        {isLow && (
                          <span className="block text-[10px] text-rose-400 uppercase font-bold">
                            Low Stock Alert
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-neutral-400">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleReorder(item.id)}
                          disabled={reorderingId === item.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider cursor-pointer transition-all ${
                            isLow
                              ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                          }`}
                        >
                          {reorderingId === item.id ? 'Reordering...' : '+ Reorder (5 Units)'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ACTIVITY AUDIT LOGS (Section 12) */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white font-['Rajdhani'] uppercase mb-1">
            Operational Telemetry Audit Trail
          </h3>
          <p className="text-xs text-neutral-400 mb-6">
            Cryptographic ledger tracking all bay transitions, status modifications, and parts restocking events.
          </p>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 font-mono text-xs"
              >
                <div
                  className={`p-2 rounded-lg ${
                    log.severity === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : log.severity === 'success'
                      ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-neutral-400 uppercase">{log.eventType}</span>
                    <span className="text-[10px] text-neutral-500">{log.timestamp}</span>
                  </div>
                  <p className="text-neutral-200 font-sans text-xs">{log.message}</p>
                  <span className="text-[10px] text-neutral-500 block mt-1">Operator: {log.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Inspection Modal */}
      {selectedBookingForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-neutral-900 border border-neutral-800 p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedBookingForInspect(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-lime-400 uppercase tracking-widest block mb-1">
              Reservation Telemetry: {selectedBookingForInspect.id}
            </span>
            <h3 className="text-2xl font-black text-white font-['Rajdhani'] mb-4">
              {selectedBookingForInspect.makeModel} ({selectedBookingForInspect.year})
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Client Name</span>
                <span className="font-bold text-white">{selectedBookingForInspect.name}</span>
                <span className="text-neutral-400 block">{selectedBookingForInspect.email}</span>
                <span className="text-neutral-400 block">{selectedBookingForInspect.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total Cost & Date</span>
                <span className="font-bold font-mono text-lime-400 text-base">₹{selectedBookingForInspect.price.toLocaleString()}</span>
                <span className="text-neutral-400 block">Date: {selectedBookingForInspect.date}</span>
                <span className="text-neutral-400 block">Current Status: {selectedBookingForInspect.status}</span>
              </div>
            </div>

            {/* Config Specs */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-6 text-xs space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Configured Modifications</span>
              <div className="grid grid-cols-2 gap-2 text-neutral-300">
                <div>• Paint: <span className="text-white font-semibold">{selectedBookingForInspect.config?.paintName || 'Acid Lime'}</span></div>
                <div>• Wheels: <span className="text-white font-semibold">{selectedBookingForInspect.config?.rimsName || 'Forged Monoblock'}</span></div>
                <div>• Tuning: <span className="text-white font-semibold">{selectedBookingForInspect.config?.tuningStage || 'Stage 2 Track'}</span></div>
                <div>• Aero: <span className="text-white font-semibold">{selectedBookingForInspect.config?.aeroKit || 'Widebody Aero'}</span></div>
              </div>
              {selectedBookingForInspect.notes && (
                <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 italic">
                  Note: "{selectedBookingForInspect.notes}"
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedBookingForInspect(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
