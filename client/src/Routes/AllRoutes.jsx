import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home/Home";
import { Dashboard } from "./Dashboard/Dashboard";
import { PageNotFound } from "./PageNotFound";
import { Community } from './Community/Community';
import { AdminPage } from './AdminPage/AdminPage';
import { ManageToken } from './ManageToken/ManageToken';
import { EventPage } from './EventPage/EventPage';

const AllRoutes = () => {
    return (
        <div className="all_routes_wrapper">
        <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route exact path="/dashboard" element={<Dashboard />}/>
            <Route exact path="/community" element={<Community />}/>
            <Route exact path="/events" element={<EventPage />}/>
            <Route exact path="/community/:id" element={<>Page</>}/>
            <Route exact path="/admin" element={<AdminPage />}/>
            <Route exact path="/manage-token" element={<ManageToken />}/>
            <Route exact path="*" element={<PageNotFound />}/>
        </Routes>
        </div>
    )
}

export { AllRoutes }