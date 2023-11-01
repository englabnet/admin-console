import React from "react";
import { Button, Group, Modal, Text } from "@mantine/core";

export default function ConfirmDialog({ text, opened, onClose, onConfirm }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm" centered>
      <Text>{text}</Text>
      <Group justify="flex-end" mt={20}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => {
          onConfirm();
          onClose();
        }}>Yes</Button>
      </Group>
    </Modal>
  )
}
