import React, { useEffect } from "react";
import {
  Button, Grid, Group, Modal, Select,
  Stack, Textarea, TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function VideoDialog({ video, opened, onClose, onSubmit }) {
  const form = useForm({
    initialValues: {
      url: '',
      variety: 'UK',
      index: true,
      subtitles: '',
    }
  });

  useEffect(() => {
    if (video) {
      form.setValues({
        url: 'https://www.youtube.com/watch?v=' + video.videoId,
        variety: video.variety,
        srt: video.srt,
      });
    }
  }, [video]);

  return (
    <Modal opened={opened} onClose={onClose} title="Video" centered size="85%">
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
            </Stack>
          </Grid.Col>
          <Grid.Col span={8}>
            <Textarea
              autosize
              minRows={25}
              maxRows={25}
              {...form.getInputProps('srt')}
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
