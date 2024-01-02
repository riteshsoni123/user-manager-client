import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "../axios";
import { useEffect, useState } from "react";

function Form(props) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { setList, list, add, setAdd, update, setUpdate, value, id } =
    props.data;

  useEffect(() => {
    if (update) {
      setUsername(value.username);
      setPhone(value.phone);
      setEmail(value.email);
    }
  }, [update, value]);

  const saveValue = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        contentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      if (add) {
        const { data } = await axios.post(
          "/api/personal/addelement",
          { username: username, phone: phone, email: email },
          config
        );
        setList(list.concat(data));
        setAdd(!add);
      } else {
        await axios.post(
          `/api/personal/editelement/${id.current}`,
          { username: username, phone: phone, email: email },
          config
        );
        const index = list.findIndex((element) => element._id === value._id);
        list[index].element = {
          username: username,
          phone: phone,
          email: email,
        };
        setList(list);
        setUpdate(!update);
      }
    } catch (error) {
      if (add) {
        console.log(error);
        console.log("Can't add the element");
      } else {
        console.log("Can't update the element");
      }
    }
  };

  return (
    <div>
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Form
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Please kindly fill the details of the Note
            </Typography>
            <form onSubmit={saveValue}>
              <Grid container spacing={1}>
                <Grid xs={12} item>
                  <TextField
                    placeholder="Enter Username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    placeholder="Enter email"
                    type="Email"
                    label="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    placeholder="Enter phone number"
                    type="tel"
                    label="Phone"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {add ? "Add" : "Update"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default Form;
