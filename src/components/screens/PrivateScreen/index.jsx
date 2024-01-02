import { React, useState, useEffect, useRef } from "react";
import axios from "../../../axios";
import { useNavigate } from "react-router-dom";
import Element from "../../Element";
import NavBar from "../../NavBar";
import Form from "../../Form";
import {
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

const PrivateScreen = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");
  const [add, setAdd] = useState(false);
  const [update, setUpdate] = useState(false);
  const [value, setValue] = useState({
    title: "",
    description: "",
  });
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const id = useRef("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }

    const fetchPrivateData = async () => {
      const config = {
        headers: {
          contentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/personal/private", config);
        setPrivateData(data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
      try {
        const { data } = await axios.get("/api/personal/getlist", config);
        setList(data);
        setFilteredList(data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };
    // const handleSearchLocalStorage = (name, phone, email) => {
    //   const filtered = list.filter(
    //     (user) =>
    //       user.username.toLowerCase().includes(name.toLowerCase()) &&
    //       user.email.toLowerCase().includes(email.toLowerCase()) &&
    //       user.phone.includes(phone)
    //   );
    //   setFilteredList(filtered);
    // };
    fetchPrivateData();
    const savedSearchName = localStorage.getItem("searchName");
    const savedSearchPhone = localStorage.getItem("searchPhone");
    const savedSearchEmail = localStorage.getItem("searchEmail");

    if (savedSearchName) setSearchName(savedSearchName);
    if (savedSearchPhone) setSearchPhone(savedSearchPhone);
    if (savedSearchEmail) setSearchEmail(savedSearchEmail);
    // handleSearchLocalStorage(
    //   savedSearchName,
    //   savedSearchPhone,
    //   savedSearchEmail
    // );
  }, [navigate, add, update, list]);

  useEffect(() => {
    // handleSearch(searchName, searchPhone, searchEmail);

    localStorage.setItem("searchName", searchName);
    localStorage.setItem("searchPhone", searchPhone);
    localStorage.setItem("searchEmail", searchEmail);
  }, [searchName, searchPhone, searchEmail]);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const deleteElement = async () => {
    const config = {
      headers: {
        contentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.post(`/api/personal/deleteelement/${id.current}`, {}, config);

      const newList = list.filter((element) => {
        return element._id !== id.current;
      });

      setList(newList);
    } catch (error) {
      localStorage.removeItem("authToken");
      setError("You are not authorized please login");
    }
  };

  const addButton = async () => {
    setAdd(!add);
  };

  const updateButton = async (val) => {
    setValue(val);
    setUpdate(!update);
  };
  const handleNameSearch = (e) => {
    setSearchName(e.target.value);
    handleSearch(e.target.value, searchPhone, searchEmail);
  };

  const handlePhoneSearch = (e) => {
    setSearchPhone(e.target.value);
    handleSearch(searchName, e.target.value, searchEmail);
  };

  const handleEmailSearch = (e) => {
    setSearchEmail(e.target.value);
    handleSearch(searchName, searchPhone, e.target.value);
  };

  const handleSearch = (name, phone, email) => {
    const filtered = list.filter(
      (user) =>
        user.username.toLowerCase().includes(name.toLowerCase()) &&
        user.email.toLowerCase().includes(email.toLowerCase()) &&
        user.phone.includes(phone)
    );
    setFilteredList(filtered);
  };

  const handleSort = (type) => {
    let sortedList = [...filteredList];
    if (type === "name") {
      sortedList.sort((a, b) => (a.username > b.username ? 1 : -1));
    } else if (type === "phone") {
      sortedList.sort((a, b) => (a.phone > b.phone ? 1 : -1));
    } else if (type === "email") {
      sortedList.sort((a, b) => (a.email > b.email ? 1 : -1));
    } else if (type === "createdAt") {
      sortedList.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    } else if (type === "updatedAt") {
      console.log("reached here");
      console.log(sortedList);
      sortedList.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
    }
    setFilteredList(sortedList);
  };

  return error ? (
    <>
      {console.log(error)}
      <span>{error}</span>
    </>
  ) : (
    <>
      <NavBar data={{ privateData, logoutHandler }} />

      {(add || update) && (
        <Form
          data={{ setList, list, add, setAdd, update, setUpdate, value, id }}
        />
      )}

      <div>
        <Button sx={{ m: 2 }} variant="contained" onClick={addButton}>
          Add Item
        </Button>
      </div>
      <div>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => handleSort("name")}
        >
          Sort by Name
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => handleSort("phone")}
        >
          Sort by Phone
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => handleSort("email")}
        >
          Sort by Email
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => handleSort("createdAt")}
        >
          Sort by Last Inserted
        </Button>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => handleSort("updatedAt")}
        >
          Sort by Last Modified
        </Button>
      </div>
      <div>
        <TextField
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => handleNameSearch(e)}
        />
        <TextField
          type="text"
          placeholder="Search by Phone"
          value={searchPhone}
          onChange={(e) => handlePhoneSearch(e)}
        />
        <TextField
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => handleEmailSearch(e)}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Last Inserted</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          {filteredList.map((element, index) => {
            return (
              <Element
                key={element._id}
                data={{ element, index, updateButton, deleteElement, id }}
              />
            );
          })}
        </Table>
      </TableContainer>
    </>
  );
};

export default PrivateScreen;
