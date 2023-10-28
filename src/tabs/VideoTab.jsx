import React, { useEffect, useState } from 'react';
import {
  Button, Center, Divider, Group, Modal,
  Pagination, Select, Stack, Table, Text, Textarea,
} from "@mantine/core";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import VideoFilter from "../components/VideoFilter.jsx";
import SortableTh from "../components/SortableTh.jsx";
import IndexingInfoDialog from "../components/IndexingInfoDialog.jsx";

const varietyMap = {
  "UK": "🇬🇧 UK",
  "US": "🇺🇸 US",
  "AUS": "🇦🇺 AUS",
}

export default function VideoTab() {
  const [response, setResponse] = useState();
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ field: 'id', dir: 'asc' });
  const [filters, setFilters] = useState({});
  const [currentVideo, setCurrentVideo] = useState();
  const [statusShown, statusHandlers] = useDisclosure(false);
  const [subtitlesShown, subtitlesHandlers] = useDisclosure(false);

  useEffect(() => {
    axios
      .get('/api/v1/indexer/videos', {
        params: {
          page: activePage - 1,
          size: pageSize,
          sort: sort.field + ',' + sort.dir,
          ...filters
        }
      })
      .then((r) => {
        setResponse(r.data);
      })
  }, [activePage, pageSize, sort, filters]);

  const rows = response?.content?.map((video) => (
    <Table.Tr key={video.id}>
      <Table.Td w={100}>{video.id}</Table.Td>
      <Table.Td w={100}>
        <img src={`http://img.youtube.com/vi/${video.videoId}/0.jpg`} height="40" />
      </Table.Td>
      <Table.Td w={100}>
        <a href={"https://www.youtube.com/watch?v=" + video.videoId} rel="noreferrer" target="_blank">{video.videoId}</a>
      </Table.Td>
      <Table.Td w={100}>{varietyMap[video.variety] || video.variety}</Table.Td>
      <Table.Td>
        <Button size="xs" variant="light" color="gray" onClick={() => {
          setCurrentVideo(video);
          subtitlesHandlers.open();
        }}>Show</Button>
      </Table.Td>
      <Table.Td w={100}>
        <Button size="xs" variant="light" color='orange'>Edit</Button>
      </Table.Td>
      <Table.Td w={100}>
        <Button size="xs" variant="light" color='red'>Delete</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack p={10} gap="xs">
        <Group justify="space-between">
          <Button variant="light" color="green">Add Video</Button>
          <Group>
            <Button variant="light" color="blue">Index</Button>
            <Button variant="light" color="yellow" onClick={statusHandlers.open}>Status</Button>
          </Group>
        </Group>
        <Divider m={0}/>
        <Group>
          <Text>Page size:</Text>
          <Select
            w={80}
            defaultValue={10}
            data={[10, 25, 50, 100]}
            allowDeselect={false}
            onChange={value => {
              setActivePage(1);
              setPageSize(value);
            }}
          />
          <Divider orientation="vertical" />
          <VideoFilter onSubmit={values => {
            setActivePage(1);
            setFilters(values);
          }} />
          <Divider orientation="vertical" />
          <Text>Total count: {response?.totalElements}</Text>
        </Group>
      </Stack>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <SortableTh field='id' sort={sort} setSort={setSort}>ID</SortableTh>
            <Table.Th>Thumbnail</Table.Th>
            <SortableTh field='videoId' sort={sort} setSort={setSort}>Video ID</SortableTh>
            <SortableTh field='variety' sort={sort} setSort={setSort}>Variety</SortableTh>
            <Table.Th>Subtitles</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Center p={10}>
        <Pagination value={activePage} onChange={setActivePage} total={response?.totalPages} />
      </Center>
      <IndexingInfoDialog opened={statusShown} onClose={statusHandlers.close}/>
      <Modal opened={subtitlesShown} onClose={subtitlesHandlers.close} title="Subtitles" centered size="50%">
        <Textarea
          autosize
          minRows={2}
          maxRows={25}
          value={currentVideo?.srt}
        />
      </Modal>
    </>
  );
}
