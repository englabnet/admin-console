import React, { useEffect, useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import axios from "axios";
import moment from "moment/moment";

const statusToColor = {
  NONE: "white",
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

  const startTime = info?.startTime ? moment(info.startTime) : null;
  const finishTime = info?.finishTime ? moment(info.finishTime) : null;
  const duration = startTime && finishTime ? moment.duration(startTime, finishTime).humanize() : null;

  return(
    <Modal opened={opened} onClose={onClose} centered title="Indexing Info">
      {info && (
        <Stack gap="xs">
          {startTime && (
            <Group gap="xs">
              <Text>
                Start time:
              </Text>
              <Text>
                {startTime.local().format(timeFormat)}
              </Text>
            </Group>
          )}
          {finishTime && (
            <Group gap="xs">
              <Text>
                Finish time:
              </Text>
              <Text>
                {finishTime.local().format(timeFormat)}
              </Text>
            </Group>
          )}
          {duration && (
            <Group gap="xs">
              <Text>
                Duration:
              </Text>
              <Text>
                {finishTime && moment.duration(startTime, finishTime).humanize()}
              </Text>
            </Group>
          )}
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
