import React from 'react';
import '@mantine/core/styles.css';
import { MantineProvider, rem, Tabs } from "@mantine/core";
import { IconMessageCircle, IconVideo } from "@tabler/icons-react";
import VideoTab from "./tabs/VideoTab.jsx";
import FeedbackTab from "./tabs/FeedbackTab.jsx";

function App() {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        fontFamily: 'Roboto, sans-serif',
        primaryColor: 'orange',
        defaultGradient: { from: 'blue.6', to: 'blue.4' },
        defaultRadius: 'md',
      }}
    >
      <Tabs defaultValue="videos">
        <Tabs.List>
          <Tabs.Tab value="videos" leftSection={<IconVideo style={iconStyle} />}>
            Videos
          </Tabs.Tab>
          <Tabs.Tab value="feedback" leftSection={<IconMessageCircle style={iconStyle} />}>
            Feedback
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="videos">
          <VideoTab />
        </Tabs.Panel>

        <Tabs.Panel value="feedback">
          <FeedbackTab />
        </Tabs.Panel>
      </Tabs>
    </MantineProvider>
  )
}

export default App
