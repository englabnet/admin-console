import React, { useEffect, useState } from 'react';
import {
  Button, Center, Divider, Group, Modal,
  Pagination, rem, Select, Table, Text, Textarea, TextInput, UnstyledButton
} from "@mantine/core";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";

const varietyMap = {
  "UK": "🇬🇧 UK",
  "US": "🇺🇸 US",
  "AUS": "🇦🇺 AUS",
}

function Th({ children, field, sort, setSort }) {
  const sorted = sort.field === field;
  const Icon = sorted ? (sort.dir === 'asc' ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={() => {
        if (sort.field === field) {
          const dir = sort.dir === 'asc' ? 'desc' : 'asc';
          setSort({field: field, dir: dir});
        } else {
          setSort({field: field, dir: 'asc'});
        }
      }}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function VideoTab() {
  const [videos, setVideos] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [sort, setSort] = useState({ field: 'id', dir: 'asc' });
  const [currentVideo, setCurrentVideo] = useState();
  const [subtitlesShown, subtitlesHandlers] = useDisclosure(false);

  useEffect(() => {
    axios
      .get('/api/v1/indexer/videos', {
        params: {
          page: activePage - 1,
          size: pageSize,
          sort: sort.field + ',' + sort.dir,
        }
      })
      .then((r) => {
        setVideos(r.data.content);
        setTotalPages(r.data.totalPages);
      })
  }, [activePage, pageSize, sort]);

  const rows = videos.map((video) => (
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
        <Group p={10}>
          <Text>Page size:</Text>
          <Select
            w={100}
            defaultValue={10}
            data={[10, 25, 50, 100]}
            allowDeselect={false}
            onChange={setPageSize}
          />
          <Divider orientation="vertical" />
          <Group>
            <TextInput w={100} placeholder={"ID"}/>
            <TextInput w={200} placeholder={"Video ID"}/>
            <Select
              w={100}
              placeholder="Pick value"
              defaultValue="ALL"
              data={['ALL', 'UK', 'US', 'AUS']}
              allowDeselect={false}
            />
            <Button variant="light" color="gray">Search</Button>
          </Group>
          <Divider orientation="vertical" />
          <Button variant="light" color="green">Add Video</Button>
          <Divider orientation="vertical" />
          <Button variant="light" color="blue">Full Reindex</Button>
          <Text>Indexing status: Done</Text>
          <Text>Duration: 4 sec</Text>
        </Group>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Th field='id' sort={sort} setSort={setSort}>ID</Th>
            <Table.Th>Thumbnail</Table.Th>
            <Th field='videoId' sort={sort} setSort={setSort}>Video ID</Th>
            <Th field='variety' sort={sort} setSort={setSort}>Variety</Th>
            <Table.Th>Subtitles</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Center p={10}>
        <Pagination value={activePage} onChange={setActivePage} total={totalPages} />
      </Center>
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
