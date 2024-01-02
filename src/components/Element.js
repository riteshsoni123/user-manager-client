import * as React from "react";
import { TableBody, TableCell, TableRow, Button } from "@mui/material";

export default function Element(props) {
  const { element, updateButton, deleteElement, id, index } = props.data;
  let date = new Date(element.createdAt);
  const updatedAt = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
  date = new Date(element.updatedAt);
  const createdAt = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };

  return (
    <TableBody>
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{element.username}</TableCell>
        <TableCell>{element.phone}</TableCell>
        <TableCell>{element.email}</TableCell>
        <TableCell>
          {createdAt.day +
            "/" +
            createdAt.month +
            "/" +
            createdAt.year +
            " " +
            createdAt.hours +
            ":" +
            createdAt.minutes +
            ":" +
            createdAt.seconds}
        </TableCell>
        <TableCell>
          {updatedAt.day +
            "/" +
            updatedAt.month +
            "/" +
            updatedAt.year +
            " " +
            updatedAt.hours +
            ":" +
            updatedAt.minutes +
            ":" +
            updatedAt.seconds}
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => {
              id.current = element._id;
              updateButton(element);
            }}
          >
            Edit
          </Button>
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => {
              id.current = element._id;
              deleteElement();
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
