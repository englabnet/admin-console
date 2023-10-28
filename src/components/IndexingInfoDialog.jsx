import React, { useEffect, useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import axios from "axios";
import moment from "moment/moment";

const statusToColor = {
  NONE: "gray",
  STARTED: "yellow",
  COMPLETED: "green",
  FAILED: "red",
}

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export default function IndexingInfoDialog({ opened, onClose }) {
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!opened) return;
    axios
      .get('/api/v1/indexer/status')
      .then((r) => {
        setInfo(r.data);
      })
  }, [opened]);

  const startTime = info && moment(info.startTime);
  const finishTime = info?.finishTime ? moment(info.finishTime) : null;

  return(
    <Modal opened={opened} onClose={onClose} centered title="Indexing Info">
      {info && (
        <Stack gap="xs">
          <Group gap="xs">
            <Text>
              Start time:
            </Text>
            <Text>
              {startTime.local().format(timeFormat)}
            </Text>
          </Group>
          <Group gap="xs">
            <Text>
              Finish time:
            </Text>
            <Text>
              {finishTime && finishTime.local().format(timeFormat)}
            </Text>
          </Group>
          <Group gap="xs">
            <Text>
              Duration:
            </Text>
            <Text>
              {finishTime && moment.duration(startTime, finishTime).humanize()}
            </Text>
          </Group>
          <Group gap="xs">
            <Text>
              Status:
            </Text>
            <Text fw={700} c={statusToColor[info.status]}>
              {info.status}
            </Text>
          </Group>
          <Group gap="xs">
            <Text>
              Message:
            </Text>
            <Text>
              {info.message}
            </Text>
          </Group>
        </Stack>
      )}
      <Group justify="flex-end">
        <Button onClick={onClose}>Close</Button>
      </Group>
    </Modal>
  )
}
