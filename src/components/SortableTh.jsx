import React from "react";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { Center, Group, rem, Table, Text, UnstyledButton } from "@mantine/core";

export default function SortableTh({ children, field, sort, setSort }) {
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
