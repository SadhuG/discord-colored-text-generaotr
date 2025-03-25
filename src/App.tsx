import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Content from "./Content";

export default function App() {
  return (
    <MantineProvider>
      <main className="h-screen w-screen bg-gray-700 text-white">
        <Content />
      </main>
    </MantineProvider>
  );
}
