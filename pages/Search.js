import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {HomeIcon, MenuIcon, UsersIcon, XIcon} from "@heroicons/react/outline";

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Analysis', href: '#', icon: UsersIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [students, setStudents] = useState(null);
  const [filterData, setFilterData ] = useState(null);
  const [rows, setRows] = useState(null);

  //Get URL and extract content
  const studentdata = 'https://www.hatchways.io/api/assessment/students';

  useEffect (() => {
    fetch(studentdata)
      .then(resp => resp.json())
      .then(data => {
        console.log(data.students);
        setFilterData(data.students);
        setStudents(data.students);
      });
  }, [])

  const searchByName = (event) => {
    event.persist();
    // Get the search term
    const searchItem = event.target.value.trim();
    // If search term is empty fill with full students data
    if(!searchItem.trim()) {
      setFilterData(students);
    }
    // Search the name and if it found return the same array
    const searchIn = (firstName, lastName) => {
      if(firstName.indexOf(searchItem) !== -1 || lastName.indexOf(searchItem) !== -1) {
        return true;
      }
      let fullName = firstName+" "+lastName;
      if(fullName.indexOf(searchItem) !== -1) {
        return true;
      }
      return false;
    };

    if (Array.isArray(students)) {
      const result2 = students.filter(item => item);
      console.log('arr is an array');
    } else {
      console.log('arr is not an array');
    }

    // Filter the array
    const filteredData = students.filter((item) => {
      return searchIn(item.firstName, item.lastName);
    });

    // Set the state with filtered data
    setFilterData(filteredData);
  }

  return (
      <div className="App">
        <h1>Students</h1>

        <div className="search" id="search">
            <input type="text" name="serachByName" onChange={(e) => searchByName(e)} ></input>
        </div>

        <table className="min-w-full divide-y divide-gray-200">

          <tbody>
            <tr>
              <th><strong>NAME</strong></th>
              <th><strong>EMAIL</strong></th>
              <th><strong>COMPANY</strong></th>
              <th><strong>SKILL</strong></th>
              <th><strong>AVERAGE</strong></th>
            </tr>
          </tbody>

          {filterData && filterData.map((student, index) => {
           var total = 0;
           for(var i = 0; i < student.grades.length; i++) {
            var grade = parseInt(student.grades[i]);
            total += grade;
           }
           const avg = total / student.grades.length;
           const average = avg.toString();


          return(
            <tbody className="student" key={index}>
              <tr className="text">
                <th id="whitespace-nowrap text-sm font-medium text-white-900">{student.firstName} {student.lastName}</th>
                <td className="whitespace-nowrap text-sm font-medium text-white-900">{student.email}</td>
                <td className="whitespace-nowrap text-sm font-medium text-white-900">{student.company}</td>
                <td className="whitespace-nowrap text-sm font-medium text-white-900">{student.skill}</td>
                <td className="whitespace-nowrap text-sm font-medium text-white-900">: {average}%</td>
              </tr>
            </tbody>

          )}
          )}
        </table>
    </div>
  );
}