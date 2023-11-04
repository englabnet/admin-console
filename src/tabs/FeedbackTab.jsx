import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Center, Group, Pagination,
  Spoiler, Table,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useDisclosure } from "@mantine/hooks";

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const typeMap = {
  "VIDEO": "🎥",
  "FEATURE": "💡",
  "BUG": "🐞",
  "OTHER": "✍️",
}

export default function VideoTab() {
  const [response, setResponse] = useState();
  const [activePage, setActivePage] = useState(1);
  const [confirmDeletingAllShown, confirmDeletingAllHandlers] = useDisclosure(false);

  const loadFeedback = useCallback(() => {
    axios
      .get('/api/v1/feedback', {
        params: {
           page: activePage - 1,
           size: 10,
         }
      })
      .then((r) => {
        setResponse(r.data);
      })
  }, [activePage]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const deleteMessage = (id) => {
    axios
      .delete(`/api/v1/feedback/${id}`)
      .then((r) => {
        console.log(r.data);
        loadFeedback();
      });
  };

  const deleteAll = () => {
    axios
      .delete(`/api/v1/feedback`)
      .then((r) => {
        console.log(r.data);
        loadFeedback();
      });
  };

  const rows = response?.content?.map((message) => (
    <Table.Tr key={message.id}>
      <Table.Td w={50}>{message.id}</Table.Td>
      <Table.Td w={150}>{message.name}</Table.Td>
      <Table.Td w={200}>{message.email}</Table.Td>
      <Table.Td w={50}>{typeMap[message.type]}</Table.Td>
      <Table.Td>
        <Spoiler maxHeight={25} showLabel="Show more" hideLabel="Hide">
          {message.message}
        </Spoiler>
      </Table.Td>
      <Table.Td w={150}>{moment(message.timestamp).local().format(timeFormat)}</Table.Td>
      <Table.Td w={100}>
        <Button size="xs" variant="light" color='red' onClick={() => {
          deleteMessage(message.id);
        }}>Delete</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="flex-end" p={10}>
        <Button variant="light" color="red" onClick={confirmDeletingAllHandlers.open}>Delete All</Button>
      </Group>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Message</Table.Th>
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Center p={10}>
        <Pagination value={activePage} onChange={setActivePage} total={response?.totalPages} />
      </Center>
      <ConfirmDialog
        opened={confirmDeletingAllShown}
        onClose={confirmDeletingAllHandlers.close}
        onConfirm={deleteAll}
        text="Do you really want to delete all messages?"
      />
    </>
  );
}
