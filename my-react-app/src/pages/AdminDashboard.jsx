import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import StatCard from "../components/admin/StatCard";
import AppointmentsTable from "../components/admin/AppointmentsTable";
import ServiceBookingsTable from "../components/admin/ServiceBookingsTable";
import CourseBookingsTable from "../components/admin/CourseBookingsTable";

import EditAppointmentModal from "../components/admin/EditAppointmentModal";
import EditServiceBookingModal from "../components/admin/EditServiceBookingModal";

import {
  getAdminStats,
  getAdminAppointments,
  deleteAdminAppointment,
  updateAdminAppointment,

  getAdminServiceBookings,
  updateAdminServiceBooking,
  deleteAdminServiceBooking,

  getAdminCourseBookings,
  updateAdminCourseBooking,
  deleteAdminCourseBooking,
} from "../api/adminApi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [courses, setCourses] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Edit states
  const [editingAppt, setEditingAppt] = useState(null);
  const [editingService, setEditingService] = useState(null);

  /* ================= AUTH + AUTO REFRESH ================= */
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }

    reloadAll();
    const id = setInterval(reloadAll, 30000);
    return () => clearInterval(id);
  }, []);

  /* ================= LOAD DATA ================= */
  const reloadAll = async () => {
    try {
      setRefreshing(true);
      const [s, a, sv, c] = await Promise.all([
        getAdminStats(),
        getAdminAppointments(),
        getAdminServiceBookings(),
        getAdminCourseBookings(),
      ]);

      setStats(s);
      setAppointments(a);
      setServices(sv);
      setCourses(c);
    } catch (err) {
      console.error("Admin reload error:", err);
      alert("Failed to refresh admin data");
    } finally {
      setRefreshing(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar active={active} onChange={setActive} onLogout={logout} />
      </div>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold capitalize text-slate-800">
            {active.replace("-", " ")}
          </h1>

          <button
            onClick={reloadAll}
            disabled={refreshing}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ================= DASHBOARD ================= */}
        {active === "dashboard" && stats && (
          <div className="space-y-8">
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard label="Appointments" value={stats.totalAppointments} />
              <StatCard label="Service Bookings" value={stats.totalServiceBookings} />
              <StatCard label="Users" value={stats.activeUsers} />
            </div>

            {/* RECENT DATA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* RECENT APPOINTMENTS */}
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold mb-4 text-slate-700">
                  Recent Appointments
                </h3>
                <ul className="space-y-2 text-sm">
                  {appointments.slice(0, 5).map((a) => (
                    <li
                      key={a._id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{a.name}</span>
                      <span className="text-gray-400">{a.time}</span>
                    </li>
                  ))}
                  {appointments.length === 0 && (
                    <p className="text-gray-400">No appointments</p>
                  )}
                </ul>
              </div>

              {/* RECENT SERVICES */}
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold mb-4 text-slate-700">
                  Recent Services
                </h3>
                <ul className="space-y-2 text-sm">
                  {services.slice(0, 5).map((s) => (
                    <li
                      key={s._id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{s.serviceName}</span>
                      <span className="text-gray-400">{s.time}</span>
                    </li>
                  ))}
                  {services.length === 0 && (
                    <p className="text-gray-400">No services</p>
                  )}
                </ul>
              </div>

              {/* RECENT COURSES */}
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold mb-4 text-slate-700">
                  Recent Course Bookings
                </h3>
                <ul className="space-y-2 text-sm">
                  {courses.slice(0, 5).map((c) => (
                    <li
                      key={c._id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{c.courseTitle}</span>
                      <span className="text-gray-400">{c.status}</span>
                    </li>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-gray-400">No courses</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {active === "appointments" && (
          <AppointmentsTable
            data={appointments}
            onEdit={(appt) => setEditingAppt(appt)}
            onDelete={async (id) => {
              if (!window.confirm("Delete this appointment?")) return;
              await deleteAdminAppointment(id);
              reloadAll();
            }}
          />
        )}

        {/* ================= SERVICES ================= */}
        {active === "services" && (
          <ServiceBookingsTable
            data={services}
            onEdit={(b) => setEditingService(b)}
            onDelete={async (id) => {
              if (!window.confirm("Delete service booking?")) return;
              await deleteAdminServiceBooking(id);
              reloadAll();
            }}
          />
        )}

        {/* ================= COURSES ================= */}
        {active === "courses" && (
          <CourseBookingsTable
            data={courses}
            onConfirm={async (id) => {
              await updateAdminCourseBooking(id, { status: "confirmed" });
              reloadAll();
            }}
            onDelete={async (id) => {
              if (!window.confirm("Delete course booking?")) return;
              await deleteAdminCourseBooking(id);
              reloadAll();
            }}
          />
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* EDIT APPOINTMENT */}
      {editingAppt && (
        <EditAppointmentModal
          open={true}
          appointment={editingAppt}
          onClose={() => setEditingAppt(null)}
          onSave={async (data) => {
            await updateAdminAppointment(editingAppt._id, data);
            setEditingAppt(null);
            reloadAll();
          }}
        />
      )}

      {/* EDIT SERVICE */}
      {editingService && (
        <EditServiceBookingModal
          open={true}
          booking={editingService}
          onClose={() => setEditingService(null)}
          onSave={async (data) => {
            await updateAdminServiceBooking(editingService._id, data);
            setEditingService(null);
            reloadAll();
          }}
        />
      )}
    </div>
  );
}
