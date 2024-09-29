import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const Dashboard = () => {
  // Static student data
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", roll_number: "001", present: true },
    { id: 2, name: "Jane Smith", roll_number: "002", present: false },
    { id: 3, name: "Alice Johnson", roll_number: "003", present: true },
  ]);

  const [newStudent, setNewStudent] = useState({ name: "", roll_number: "" });
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal state

  // Toggle student attendance (present/absent)
  const toggleAttendance = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  // Add new student to the list
  const addStudent = () => {
    if (newStudent.name && newStudent.roll_number) {
      setStudents([
        ...students,
        { ...newStudent, id: students.length + 1, present: false },
      ]);
      setNewStudent({ name: "", roll_number: "" });
    }
  };

  // Delete all students
  const deleteAllStudents = () => {
    setStudents([]);
    onOpenChange(false); // Close modal after deletion
  };

  // Download Excel function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Present Students");
    XLSX.writeFile(workbook, "Present_Students.xlsx");
  };

  return (
    <>
      <div className={`p-10 transition ${isOpen ? "blur-sm" : ""}`}>
        <h1 className="text-2xl font-bold mb-5">Present Students Dashboard</h1>

        {/* Button to download Excel file */}
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white py-2 px-4 rounded-md mb-5 hover:bg-green-700"
        >
          Download as Excel
        </button>

        {/* Table for student list */}
        <table className="min-w-full bg-white mb-5">
          <thead>
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Roll Number</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.roll_number}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`py-2 px-4 rounded ${
                      student.present ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {student.present ? "Present" : "Absent"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form to add new students */}
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-2">Add Student</h2>
          <input
            className="border px-2 py-1 mr-2"
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <input
            className="border px-2 py-1 mr-2"
            type="text"
            placeholder="Roll Number"
            value={newStudent.roll_number}
            onChange={(e) =>
              setNewStudent({ ...newStudent, roll_number: e.target.value })
            }
          />
          <button
            onClick={addStudent}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Student
          </button>
        </div>

        {/* Button to delete all students */}
        <button
          onClick={onOpen}
          className="bg-red-500 text-white py-2 px-4 rounded-md mb-5 hover:bg-red-700"
        >
          Delete All Students
        </button>
      </div>

      {/* Modal for deleting all students */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="fixed inset-0 h-[300px] flex items-center justify-center"
      >
        <ModalContent className="bg-white shadow-lg rounded-lg border p-6 max-w-lg  mx-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-semibold text-red-600 text-center">
                Confirm Deletion
              </ModalHeader>
              <ModalBody className="text-center">
                <p className="text-gray-600">
                  Are you sure you want to delete all students from the list?
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter className="flex justify-center gap-3">
                <Button
                  color="danger"
                  variant="light"
                  className="w-24 py-2"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  className="w-24 py-2"
                  onPress={deleteAllStudents}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Dashboard;
