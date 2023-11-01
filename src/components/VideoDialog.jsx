import React from "react";
import {
  Button, Grid, Group, Modal, Select,
  Stack, Switch, Textarea, TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function VideoDialog({ opened, onClose, onSubmit }) {
  const form = useForm({
    initialValues: {
      url: '',
      variety: 'UK',
      index: true,
      subtitles: '',
    }
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Video" centered size="80%">
      <form onSubmit={form.onSubmit(values => {
        values.videoId = values.url.replace(/.*youtube\.com\/watch\?v=/g, '');
        onSubmit(values);
        onClose();
      })}>
        <Grid>
          <Grid.Col span={4}>
            <Stack justify="flex-start">
              <TextInput label="URL" {...form.getInputProps('url')}/>
              <Select
                label="English variety"
                defaultValue="ALL"
                data={['UK', 'US', 'AUS']}
                allowDeselect={false}
                {...form.getInputProps('variety')}
              />
              <Switch defaultChecked label="Index" {...form.getInputProps('index')}/>
            </Stack>
          </Grid.Col>
          <Grid.Col span={8}>
            <Textarea
              autosize
              minRows={25}
              maxRows={25}
              {...form.getInputProps('subtitles')}
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt={20}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  )
}
