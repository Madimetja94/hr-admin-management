"use client";
import Departments from "./deparments/Departments";
import Header from "./header";
import Profile from "./profile/profile";
import Employees from "./employees/employees";
import { useState } from "react";
const MainComponent = ({session}) => {
  const [selectedPage, setSelectedPage] = useState<"profile" | "departments" | "employees">(
    "profile",
  );
  const handleMenuClick = (page: String) => {
    setSelectedPage(page);
  };
    return (
      <>
        <Header session={session} onMenuClick={handleMenuClick} />
        <main className="container mx-auto p-4">
          {selectedPage === "profile" && <Profile session={session} />}
          {selectedPage === "departments" && <Departments session={session} />}
          {selectedPage === "employees" && <Employees session={session}/>}
        </main>
      </>
    );

}

export default MainComponent 