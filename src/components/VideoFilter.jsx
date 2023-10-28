import { React } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";

export default function VideoFilter({ onSubmit }) {
  const form = useForm({
    initialValues: {
      id: null,
      videoId: null,
      variety: 'ALL',
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Group>
        <NumberInput w={100} placeholder={"ID"} {...form.getInputProps('id')}/>
        <TextInput w={200} placeholder={"Video ID"} {...form.getInputProps('videoId')}/>
        <Select
          w={80}
          defaultValue="ALL"
          data={['ALL', 'UK', 'US', 'AUS']}
          allowDeselect={false}
          {...form.getInputProps('variety')}
        />
        <Button variant="light" color="gray" type="submit">Search</Button>
      </Group>
    </form>
  );
}
